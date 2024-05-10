import { describe, it, beforeEach, afterEach, expect } from "vitest";

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

  it("should be able to update the text and colon", () => {
    createSetBlock(workspace, "NoAh", true);
    createSetBlock(workspace, "1010", false);

    const event = createTestEvent(setupBlock.id);
    const frames = eventToFrameFactory(event).frames;

    expect(frames.length).toBe(3);
    verifyFrame(frames[0], false, "", "Setting up digital display.");
    verifyFrame(frames[1], false, "1010");
    verifyFrame(frames[2], true, "NoAh");
  });
});

const createSetBlock = (
  workspace: Workspace,
  text: string,
  colonOn: boolean
) => {
  const blockSetText = workspace.newBlock("digital_display_set") as BlockSvg;

  blockSetText.setFieldValue(colonOn ? "TRUE" : "FALSE", "COLON");
  const textBlock = createValueBlock(workspace, VariableTypes.STRING, text);

  blockSetText.getInput("TEXT").connection.connect(textBlock.outputConnection);

  connectToArduinoBlock(blockSetText);
};

function verifyFrame(
  frame: ArduinoFrame,
  colonOn: boolean,
  text: string,
  explanation = ""
) {
  expect(frame.explanation).toBe(
    explanation ||
      `Setting Digital Display text to "${text}" and colon is ${
        colonOn ? "on" : "off"
      }.`
  );

  const state = frame.components[0] as DigitilDisplayState;
  expect(state.colonOn).toBe(colonOn);
  expect(state.chars).toBe(text);
  expect(state.clkPin).toBe(ARDUINO_PINS.PIN_11);
  expect(state.dioPin).toBe(ARDUINO_PINS.PIN_12);
}
