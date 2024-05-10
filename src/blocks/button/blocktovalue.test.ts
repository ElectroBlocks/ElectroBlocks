import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { ButtonState } from "./state";

describe("button state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("2", "LOOP_TIMES");
  });

  it("should be able generate state for button setup block", () => {
    const buttonSetup1 = workspace.newBlock("button_setup") as BlockSvg;
    buttonSetup1.setFieldValue("3", "PIN");
    buttonSetup1.setFieldValue("TRUE", "is_pressed");

    const buttonSetup2 = workspace.newBlock("button_setup") as BlockSvg;
    buttonSetup2.setFieldValue("5", "PIN");
    buttonSetup2.setFieldValue("FALSE", "is_pressed");
    saveDebugData(buttonSetup1, buttonSetup2);

    buttonSetup1.setFieldValue("2", "LOOP");
    buttonSetup2.setFieldValue("2", "LOOP");
    buttonSetup2.setFieldValue("TRUE", "is_pressed");
    buttonSetup1.setFieldValue("FALSE", "is_pressed");
    saveDebugData(buttonSetup1, buttonSetup2);

    const setVariablePin3 = createSetVariableBlock(
      workspace,
      "block1",
      ARDUINO_PINS.PIN_3
    );

    const setVariablePin5 = createSetVariableBlock(
      workspace,
      "block2",
      ARDUINO_PINS.PIN_5
    );
    connectToArduinoBlock(setVariablePin3);
    setVariablePin3.nextConnection.connect(setVariablePin5.previousConnection);
    const event = createTestEvent(setVariablePin3.id);

    const [setup1, setup2, state1, state2, state3, state4] =
      eventToFrameFactory(event).frames;

    expect(state1.variables["block1"].value).toBeTruthy();
    verifyState(state1, true, false);
    verifyState(state2, true, false);
    verifyState(state3, false, true);
    verifyState(state4, false, true);
    verifyVariables(state2, true, false);
    verifyVariables(state3, false, false);
    verifyVariables(state4, false, true);
  });
});

const verifyVariables = (
  state: ArduinoFrame,
  block1Value: boolean,
  block2Value: boolean
) => {
  expect(state.variables["block1"].value).toBe(block1Value);
  expect(state.variables["block2"].value).toBe(block2Value);
};

const verifyState = (
  state: ArduinoFrame,
  pin3Pressed: boolean,
  pin5Pressed: boolean
) => {
  const buttonPin3 = findComponent<ButtonState>(
    state,
    ArduinoComponentType.BUTTON,
    ARDUINO_PINS.PIN_3
  );

  const buttonPin5 = findComponent<ButtonState>(
    state,
    ArduinoComponentType.BUTTON,
    ARDUINO_PINS.PIN_5
  );

  expect(buttonPin3.isPressed).toBe(pin3Pressed);
  expect(buttonPin5.isPressed).toBe(pin5Pressed);
};

const createSetVariableBlock = (
  workspace: Workspace,
  variableName: string,
  pin: ARDUINO_PINS
) => {
  const setBoolVariableBlock = createSetVariableBlockWithValue(
    workspace,
    variableName,
    VariableTypes.BOOLEAN,
    true
  );
  setBoolVariableBlock.getInput("VALUE").connection.targetBlock().dispose(true);

  const isButtonPressed = workspace.newBlock("is_button_pressed");
  isButtonPressed.setFieldValue(pin, "PIN");
  setBoolVariableBlock
    .getInput("VALUE")
    .connection.connect(isButtonPressed.outputConnection);

  return setBoolVariableBlock;
};

const saveDebugData = (buttonSetup1: BlockSvg, buttonSetup2: BlockSvg) => {
  saveSensorSetupBlockData(createTestEvent(buttonSetup1.id)).forEach(updater);

  saveSensorSetupBlockData(createTestEvent(buttonSetup2.id)).forEach(updater);
};
