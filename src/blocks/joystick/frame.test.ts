import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import _ from "lodash";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { updater } from "../../core/blockly/updater";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import type { JoystickState } from "./state";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";

describe("Tests the joy stick out", () => {
  let workspace: Workspace;
  let joystickSetup;
  let arduinoSetupBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoSetupBlock] = createArduinoAndWorkSpace();
    arduinoSetupBlock.setFieldValue("2", "LOOP_TIMES");
    joystickSetup = workspace.newBlock("joystick_setup") as BlockSvg;
    joystickSetup.setFieldValue(ARDUINO_PINS.PIN_A2, "PIN_X");
    joystickSetup.setFieldValue(ARDUINO_PINS.PIN_A4, "PIN_Y");
    joystickSetup.setFieldValue(ARDUINO_PINS.PIN_7, "PIN_BUTTON");
    joystickSetup.setFieldValue("1", "LOOP");
    joystickSetup.setFieldValue("FALSE", "ENGAGED");
    joystickSetup.setFieldValue("0", "DEGREE");
    joystickSetup.setFieldValue("FALSE", "BUTTON_PRESSED");

    saveSensorSetupBlockData(createTestEvent(joystickSetup.id)).forEach(
      updater
    );

    joystickSetup.setFieldValue("2", "LOOP");
    joystickSetup.setFieldValue("TRUE", "ENGAGED");
    joystickSetup.setFieldValue("90", "DEGREE");
    joystickSetup.setFieldValue("TRUE", "BUTTON_PRESSED");

    saveSensorSetupBlockData(createTestEvent(joystickSetup.id)).forEach(
      updater
    );
  });

  it("should have the sensor values during through each loop", () => {
    const degreeJoystickBlock = workspace.newBlock("joystick_angle");
    const degreeVarBlock = createSetVariableBlockWithValue(
      workspace,
      "degrees",
      VariableTypes.NUMBER,
      0
    );
    degreeVarBlock.getInput("VALUE").connection.targetBlock().dispose(true);
    degreeVarBlock
      .getInput("VALUE")
      .connection.connect(degreeJoystickBlock.outputConnection);

    connectToArduinoBlock(degreeVarBlock);

    const event = createTestEvent(degreeVarBlock.id);

    const frameContainer = eventToFrameFactory(event);
    const frames = frameContainer.frames;
    expect(frames.length).toBe(3);

    const [frame1, frame2, frame3] = frames;
    console.log(joystickSetup.data, "data");
    expect(frame1.explanation).toBe("Setting up joystick.");
    verifyState(frame1, false, false, 0);
    verifyState(frame2, false, false, 0);
    verifyState(frame3, true, true, 90);
  });

  function verifyState(
    frame: ArduinoFrame,
    engaged: boolean,
    pressed: boolean,
    degrees: number
  ) {
    const state = frame.components[0] as JoystickState;
    expect(state.type).toBe(ArduinoComponentType.JOYSTICK);
    expect(state.xPin).toBe(ARDUINO_PINS.PIN_A2);
    expect(state.yPin).toBe(ARDUINO_PINS.PIN_A4);
    expect(state.buttonPin).toBe(ARDUINO_PINS.PIN_7);

    expect(state.degree).toBe(degrees);
    expect(state.buttonPressed).toBe(pressed);
    expect(state.engaged).toBe(engaged);
  }
});
