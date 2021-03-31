import "jest";
import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
  createValueBlock,
} from "../../tests/tests.helper";
import {
  connectToArduinoBlock,
  createBlock,
} from "../../core/blockly/helpers/block.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import { DigitilDisplayState } from "./state";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

describe("test digital display", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  let setupBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    setupBlock = workspace.newBlock("digital_display_setup") as BlockSvg;
    setupBlock.setFieldValue(ARDUINO_PINS.PIN_11, "CLK_PIN");
    setupBlock.setFieldValue(ARDUINO_PINS.PIN_12, "DIO_PIN");
  });

  test("should be able to update the text", () => {
    const blockSetText = workspace.newBlock(
      "digital_display_set_text"
    ) as BlockSvg;

    const textBlock = createValueBlock(workspace, VariableTypes.STRING, "FiRe");

    blockSetText
      .getInput("TEXT")
      .connection.connect(textBlock.outputConnection);

    connectToArduinoBlock(blockSetText);

    const event = createTestEvent(setupBlock.id);
    const frames = eventToFrameFactory(event).frames;

    expect(frames.length).toBe(2);

    expect(frames[1].explanation).toBe(
      `Setting digital display text to "FiRe"`
    );

    const component = frames[1].components[0] as DigitilDisplayState;

    expect(component.chars).toBe("FiRe");
    expect(component.type).toBe(ArduinoComponentType.DIGITAL_DISPLAY);
  });

  test("should be able to set the text on display and dots", () => {
    function createDotBlock(top: boolean, bottom: boolean) {
      const block = workspace.newBlock("digital_display_set_dots");
      block.setFieldValue("TOP_DOT", top ? "TRUE" : "FALSE");
      block.setFieldValue("BOTTOM_DOT", bottom ? "TRUE" : "FALSE");
      connectToArduinoBlock(block as BlockSvg);
    }

    function verifyDotState(
      frame: ArduinoFrame,
      top: boolean,
      bottom: boolean
    ) {
      expect(frame.explanation).toBe(
        `Digital Display top dot ${top ? "on" : "off"} and bottom dot ${
          bottom ? "on" : "off"
        }.`
      );

      const state = frame.components[0] as DigitilDisplayState;
      console.log(state, "state");
      expect(state.bottomDotOn).toBe(bottom);
      expect(state.topDotOn).toBe(top);
      expect(state.chars).toBe("");
      expect(state.clkPin).toBe(ARDUINO_PINS.PIN_11);
      expect(state.dioPin).toBe(ARDUINO_PINS.PIN_12);
    }
    createDotBlock(false, false);
    createDotBlock(true, true);
    createDotBlock(false, true);
    createDotBlock(true, false);

    const event = createTestEvent(setupBlock.id);
    const frames = eventToFrameFactory(event).frames;

    expect(frames.length).toBe(5);

    const [frame1, frame2, frame3, frame4, frame5] = frames;

    expect(frame1.explanation).toBe("Setting up digital display.");
    verifyDotState(frame2, true, false);
    verifyDotState(frame3, false, true);
    verifyDotState(frame4, true, true);
    verifyDotState(frame5, false, false);
  });
});
