import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import { LCDScreenState, LCD_SCREEN_MEMORY_TYPE } from "./state";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";

describe("lcd  factories", () => {
  let workspace: Workspace;
  let lcdsetup: BlockSvg;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    lcdsetup = workspace.newBlock("lcd_setup") as BlockSvg;

    lcdsetup.setFieldValue("0x27", "MEMORY_TYPE");
    lcdsetup.setFieldValue("20 x 4", "SIZE");
  });

  it("should be able generate state for lcd setup block", () => {
    const event = createTestEvent(lcdsetup.id);

    const lcdState: LCDScreenState = {
      pins: [ARDUINO_PINS.PIN_A4, ARDUINO_PINS.PIN_A5],
      backLightOn: true,
      blink: { row: 0, column: 0, blinking: false },
      memoryType: LCD_SCREEN_MEMORY_TYPE["0X27"],
      rowsOfText: [
        "                    ",
        "                    ",
        "                    ",
        "                    ",
      ],
      rows: 4,
      columns: 20,
      type: ArduinoComponentType.LCD_SCREEN,
      sdaPin: ARDUINO_PINS.PIN_A4,
      sclPin: ARDUINO_PINS.PIN_A5,
    };

    const state: ArduinoFrame = {
      blockId: lcdsetup.id,
      blockName: "lcd_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up LCD Screen.",
      components: [lcdState],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
      frameNumber: 1,
    };

    expect(eventToFrameFactory(event).frames).toEqual([state]);
  });

  it("LCD Screen simple print should print something simple", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const lcdPrintLCDBlock = workspace.newBlock(
      "lcd_screen_simple_print"
    ) as BlockSvg;

    const textRowBlock1 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "HELLO"
    );

    const textRowBlock2 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "WORLDWORLDWORLDWORLD12345"
    );

    const numBlock = createValueBlock(workspace, VariableTypes.NUMBER, 3);
    lcdPrintLCDBlock
      .getInput("ROW_1")
      .connection.connect(textRowBlock1.outputConnection);
    lcdPrintLCDBlock
      .getInput("ROW_2")
      .connection.connect(textRowBlock2.outputConnection);

    lcdPrintLCDBlock
      .getInput("DELAY")
      .connection.connect(numBlock.outputConnection);

    connectToArduinoBlock(lcdPrintLCDBlock);

    const event = createTestEvent(lcdsetup.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;
    const lcdState = state2.components.find(
      (c) => c.type === ArduinoComponentType.LCD_SCREEN
    ) as LCDScreenState;
    expect(state2.explanation).toBe("Printing message for 3.00 seconds.");
    expect(state2.delay).toBe(3000);
    expect(lcdState.rowsOfText[0]).toBe("HELLO               "); // ADDS THE SPACE
    expect(lcdState.rowsOfText[1]).toBe("WORLDWORLDWORLDWORLD"); // CUTS OFF THE 12345
    expect(lcdState.rowsOfText[2]).toBe("                    ");
    expect(lcdState.rowsOfText[3]).toBe("                    ");

    const lcdState2 = state3.components.find(
      (c) => c.type === ArduinoComponentType.LCD_SCREEN
    ) as LCDScreenState;

    expect(state3.explanation).toBe("Clearing the screen.");
    expect(state3.delay).toBe(0);
    expect(lcdState2.rowsOfText[0]).toBe("                    ");
    expect(lcdState2.rowsOfText[1]).toBe("                    ");
    expect(lcdState2.rowsOfText[2]).toBe("                    ");
    expect(lcdState2.rowsOfText[3]).toBe("                    ");
  });

  it("should be able to move test to right and then to left", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const textBlock = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "HELLO   WORLD!!!"
    );
    const rowNumBlock = createValueBlock(workspace, VariableTypes.NUMBER, 1);

    const colNumBlock = createValueBlock(workspace, VariableTypes.NUMBER, 1);

    const printBlock = workspace.newBlock("lcd_screen_print") as BlockSvg;
    printBlock.getInput("PRINT").connection.connect(textBlock.outputConnection);
    printBlock.getInput("ROW").connection.connect(rowNumBlock.outputConnection);
    printBlock
      .getInput("COLUMN")
      .connection.connect(colNumBlock.outputConnection);

    const simpleForLoopRight = workspace.newBlock(
      "controls_repeat_ext"
    ) as BlockSvg;
    const numberOfTimesRightBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      4
    );
    const lcdScrollRightBlock = workspace.newBlock("lcd_scroll");
    lcdScrollRightBlock.setFieldValue("RIGHT", "DIR");
    simpleForLoopRight
      .getInput("DO")
      .connection.connect(lcdScrollRightBlock.previousConnection);
    simpleForLoopRight
      .getInput("TIMES")
      .connection.connect(numberOfTimesRightBlock.outputConnection);

    const simpleForLoopLeft = workspace.newBlock(
      "controls_repeat_ext"
    ) as BlockSvg;
    const numberOfTimesLeftBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      4
    );
    const lcdScrollLeftBlock = workspace.newBlock("lcd_scroll");
    lcdScrollLeftBlock.setFieldValue("LEFT", "DIR");
    simpleForLoopLeft
      .getInput("DO")
      .connection.connect(lcdScrollLeftBlock.previousConnection);
    simpleForLoopLeft
      .getInput("TIMES")
      .connection.connect(numberOfTimesLeftBlock.outputConnection);

    connectToArduinoBlock(printBlock);
    printBlock.nextConnection.connect(simpleForLoopRight.previousConnection);
    simpleForLoopRight.nextConnection.connect(
      simpleForLoopLeft.previousConnection
    );

    const event = createTestEvent(lcdsetup.id);

    const [
      setupLCDState,
      printBlockState,
      loopRight1State,
      moveRight1State,
      loopRight2State,
      moveRight2State,
      loopRight3State,
      moveRight3State,
      loopRight4State,
      moveRight4State,
      loopLeft1State,
      moveLeft1State,
      loopLeft2State,
      moveLeft2State,
      loopLeft3State,
      moveLeft3State,
      loopLeft4State,
      moveLeft4State,
    ] = eventToFrameFactory(event).frames;

    confirmScrollMove(
      printBlockState,
      printBlock.id,
      "HELLO   WORLD!!!    ",
      'Printing "HELLO   WORLD!!!" to the screen at position (1, 1).'
    );

    confirmScrollMove(
      moveRight1State,
      lcdScrollRightBlock.id,
      " HELLO   WORLD!!!   ",
      "Scrolling text to the right."
    );

    confirmScrollMove(
      moveRight2State,
      lcdScrollRightBlock.id,
      "  HELLO   WORLD!!!  ",
      "Scrolling text to the right."
    );

    confirmScrollMove(
      moveRight3State,
      lcdScrollRightBlock.id,
      "   HELLO   WORLD!!! ",
      "Scrolling text to the right."
    );

    confirmScrollMove(
      moveRight4State,
      lcdScrollRightBlock.id,
      "    HELLO   WORLD!!!",
      "Scrolling text to the right."
    );

    confirmScrollMove(
      moveLeft1State,
      lcdScrollLeftBlock.id,
      "   HELLO   WORLD!!! ",
      "Scrolling text to the left."
    );

    confirmScrollMove(
      moveLeft2State,
      lcdScrollLeftBlock.id,
      "  HELLO   WORLD!!!  ",
      "Scrolling text to the left."
    );

    confirmScrollMove(
      moveLeft3State,
      lcdScrollLeftBlock.id,
      " HELLO   WORLD!!!   ",
      "Scrolling text to the left."
    );

    confirmScrollMove(
      moveLeft4State,
      lcdScrollLeftBlock.id,
      "HELLO   WORLD!!!    ",
      "Scrolling text to the left."
    );
  });

  it("test print block an row and column over flow gets cut off.", () => {
    const textBlock = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "THIS IS GOOFY"
    );
    const rowNumBlock = createValueBlock(workspace, VariableTypes.NUMBER, 5);

    const colNumBlock = createValueBlock(workspace, VariableTypes.NUMBER, 20);
    const printBlock = workspace.newBlock("lcd_screen_print") as BlockSvg;

    printBlock.getInput("PRINT").connection.connect(textBlock.outputConnection);
    printBlock.getInput("ROW").connection.connect(rowNumBlock.outputConnection);
    printBlock
      .getInput("COLUMN")
      .connection.connect(colNumBlock.outputConnection);

    connectToArduinoBlock(printBlock);

    const event = createTestEvent(lcdsetup.id);

    const [state1, state2] = eventToFrameFactory(event).frames;

    expect(state2.explanation).toBe(
      'Printing "THIS IS GOOFY" to the screen at position (20, 4).'
    );
    const lcdState = findComponent<LCDScreenState>(
      state2,
      ArduinoComponentType.LCD_SCREEN
    );
    expect(lcdState.rowsOfText[3]).toBe("                   T");
  });

  it("should be able to write over text with the print block", () => {
    const textBlock1 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "Score: 10"
    );
    const rowNumBlock1 = createValueBlock(workspace, VariableTypes.NUMBER, 2);

    const colNumBlock1 = createValueBlock(workspace, VariableTypes.NUMBER, 2);
    const printBlock1 = workspace.newBlock("lcd_screen_print") as BlockSvg;

    printBlock1
      .getInput("PRINT")
      .connection.connect(textBlock1.outputConnection);
    printBlock1
      .getInput("ROW")
      .connection.connect(rowNumBlock1.outputConnection);
    printBlock1
      .getInput("COLUMN")
      .connection.connect(colNumBlock1.outputConnection);

    const textBlock2 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "Score: 20"
    );
    const rowNumBlock2 = createValueBlock(workspace, VariableTypes.NUMBER, 2);

    const colNumBlock2 = createValueBlock(workspace, VariableTypes.NUMBER, 2);
    const printBlock2 = workspace.newBlock("lcd_screen_print") as BlockSvg;

    printBlock2
      .getInput("PRINT")
      .connection.connect(textBlock2.outputConnection);
    printBlock2
      .getInput("ROW")
      .connection.connect(rowNumBlock2.outputConnection);
    printBlock2
      .getInput("COLUMN")
      .connection.connect(colNumBlock2.outputConnection);

    connectToArduinoBlock(printBlock2);
    connectToArduinoBlock(printBlock1);

    const event = createTestEvent(lcdsetup.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;

    expect(state2.explanation).toBe(
      'Printing "Score: 10" to the screen at position (2, 2).'
    );
    const lcdState1 = findComponent<LCDScreenState>(
      state2,
      ArduinoComponentType.LCD_SCREEN
    );

    expect(lcdState1.rowsOfText[1]).toBe(" Score: 10          ");

    expect(state2.explanation).toBe(
      'Printing "Score: 10" to the screen at position (2, 2).'
    );
    const lcdState2 = findComponent<LCDScreenState>(
      state3,
      ArduinoComponentType.LCD_SCREEN
    );

    expect(lcdState2.rowsOfText[1]).toBe(" Score: 20          ");

    expect(state3.explanation).toBe(
      'Printing "Score: 20" to the screen at position (2, 2).'
    );
  });

  it("should be able to make the lcd blink and save the state", () => {
    const turnOnBlink = workspace.newBlock("lcd_blink") as BlockSvg;
    const colBlockBlinkOn = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      20
    );
    const rowBlockBlinkOn = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      2
    );

    turnOnBlink.setFieldValue("BLINK", "BLINK");
    turnOnBlink
      .getInput("ROW")
      .connection.connect(rowBlockBlinkOn.outputConnection);
    turnOnBlink
      .getInput("COLUMN")
      .connection.connect(colBlockBlinkOn.outputConnection);

    const textBlock1 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "What is your name?"
    );
    const rowNumBlock1 = createValueBlock(workspace, VariableTypes.NUMBER, 2);

    const colNumBlock1 = createValueBlock(workspace, VariableTypes.NUMBER, 2);
    const printBlock1 = workspace.newBlock("lcd_screen_print") as BlockSvg;

    printBlock1
      .getInput("PRINT")
      .connection.connect(textBlock1.outputConnection);
    printBlock1
      .getInput("ROW")
      .connection.connect(rowNumBlock1.outputConnection);
    printBlock1
      .getInput("COLUMN")
      .connection.connect(colNumBlock1.outputConnection);

    const colBlockBlinkOff = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      20
    );
    const rowBlockBlinkOff = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      2
    );

    const turnoffBlink = workspace.newBlock("lcd_blink");

    turnoffBlink.setFieldValue("OFF", "BLINK");
    turnoffBlink
      .getInput("ROW")
      .connection.connect(rowBlockBlinkOff.outputConnection);
    turnoffBlink
      .getInput("COLUMN")
      .connection.connect(colBlockBlinkOff.outputConnection);

    connectToArduinoBlock(turnOnBlink);
    turnOnBlink.nextConnection.connect(printBlock1.previousConnection);
    printBlock1.nextConnection.connect(turnoffBlink.previousConnection);

    const event = createTestEvent(lcdsetup.id);

    const [state1, state2, state3, state4] = eventToFrameFactory(event).frames;
    confirmBlinkAndExplanation(
      state2,
      turnOnBlink.id,
      true,
      2,
      20,
      "Turning on blinking at (20, 2)."
    );

    confirmBlinkAndExplanation(
      state3,
      printBlock1.id,
      true,
      2,
      20,
      'Printing "What is your name?" to the screen at position (2, 2).'
    );

    confirmBlinkAndExplanation(
      state4,
      turnoffBlink.id,
      false,
      0,
      0,
      "Turning off blinking."
    );
  });

  it("should be able to clear everything off a screen", () => {
    const textBlock1 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "What is your name?"
    );
    const rowNumBlock1 = createValueBlock(workspace, VariableTypes.NUMBER, 2);

    const colNumBlock1 = createValueBlock(workspace, VariableTypes.NUMBER, 2);
    const printBlock1 = workspace.newBlock("lcd_screen_print") as BlockSvg;

    printBlock1
      .getInput("PRINT")
      .connection.connect(textBlock1.outputConnection);
    printBlock1
      .getInput("ROW")
      .connection.connect(rowNumBlock1.outputConnection);
    printBlock1
      .getInput("COLUMN")
      .connection.connect(colNumBlock1.outputConnection);

    const clearBlock = workspace.newBlock("lcd_screen_clear");

    printBlock1.nextConnection.connect(clearBlock.previousConnection);

    connectToArduinoBlock(printBlock1);

    const event = createTestEvent(lcdsetup.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;
    const lcdState2 = findComponent<LCDScreenState>(
      state2,
      ArduinoComponentType.LCD_SCREEN
    );

    expect(lcdState2.rowsOfText[1]).toBe(" What is your name? ");

    const lcdState3 = findComponent<LCDScreenState>(
      state2,
      ArduinoComponentType.LCD_SCREEN
    );

    expect(lcdState3.rowsOfText[0]).toBe("                    ");
    expect(state3.explanation).toBe("Clearing the screen.");
  });

  it("should be able to turn the back light on and off", () => {
    const backLightOn = workspace.newBlock("lcd_backlight") as BlockSvg;
    const backLightOff = workspace.newBlock("lcd_backlight");

    backLightOn.setFieldValue("ON", "BACKLIGHT");
    backLightOff.setFieldValue("OFF", "BACKLIGHT");
    connectToArduinoBlock(backLightOn);
    backLightOn.nextConnection.connect(backLightOff.previousConnection);

    const event = createTestEvent(lcdsetup.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;

    expect(state2.explanation).toBe("Turning on backlight.");
    const lcdState1 = findComponent<LCDScreenState>(
      state2,
      ArduinoComponentType.LCD_SCREEN
    );
    expect(lcdState1.backLightOn).toBeTruthy();

    expect(state3.explanation).toBe("Turning off backlight.");
    const lcdState2 = findComponent<LCDScreenState>(
      state3,
      ArduinoComponentType.LCD_SCREEN
    );
    expect(lcdState2.backLightOn).toBeFalsy();
  });

  const confirmBlinkAndExplanation = (
    actualState: ArduinoFrame,
    blockId: string,
    isBlinking: boolean,
    blinkRow: number,
    blinkCol: number,
    explanationText: string
  ) => {
    expect(actualState.blockId).toBe(blockId);
    expect(actualState.explanation).toBe(explanationText);
    const lcdState = findComponent<LCDScreenState>(
      actualState,
      ArduinoComponentType.LCD_SCREEN
    );
    expect(lcdState.blink.blinking).toBe(isBlinking);
    expect(lcdState.blink.row).toBe(blinkRow);
    expect(lcdState.blink.column).toBe(blinkCol);
  };

  const confirmScrollMove = (
    actualState: ArduinoFrame,
    blockId: string,
    row1Text: string,
    explanationText: string
  ) => {
    const lcdComponent = findComponent<LCDScreenState>(
      actualState,
      ArduinoComponentType.LCD_SCREEN
    );
    expect(lcdComponent.rowsOfText[0]).toBe(row1Text);
    expect(actualState.blockId).toBe(blockId);
    expect(actualState.explanation).toBe(explanationText);
  };
});
