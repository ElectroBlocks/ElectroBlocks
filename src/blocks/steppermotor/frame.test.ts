import { BlockSvg, Workspace } from "blockly";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import "../../tests/fake-block";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
  createValueBlock,
} from "../../tests/tests.helper";
import { StepperMotorState } from "./state";

describe("Passive Buzzer Tests", () => {
  let workspace: Workspace;
  let passivebuzzer: BlockSvg;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  it("should be able to setup and move the stepper motor.", () => {
    const setupBlock = workspace.newBlock("stepper_motor_setup");
    setupBlock.setFieldValue(ARDUINO_PINS.PIN_4, "PIN_1");
    setupBlock.setFieldValue(ARDUINO_PINS.PIN_5, "PIN_2");
    setupBlock.setFieldValue(ARDUINO_PINS.PIN_6, "PIN_3");
    setupBlock.setFieldValue(ARDUINO_PINS.PIN_7, "PIN_4");
    setupBlock.setFieldValue("300", "TOTAL_STEPS");
    const moveBlock1Number = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      20
    );
    const moveBlock1 = workspace.newBlock("stepper_motor_move") as BlockSvg;
    moveBlock1
      .getInput("STEPS")
      .connection.connect(moveBlock1Number.outputConnection);

    const moveBlock2Number = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      -30
    );
    const moveBlock2 = workspace.newBlock("stepper_motor_move") as BlockSvg;
    moveBlock2
      .getInput("STEPS")
      .connection.connect(moveBlock2Number.outputConnection);

    connectToArduinoBlock(moveBlock2);
    connectToArduinoBlock(moveBlock1);

    const event = createTestEvent(moveBlock1.id);

    const frameContainer = eventToFrameFactory(event);

    const [frame1, frame2, frame3] = frameContainer.frames;

    verifySetupFrame(frame1, 0, 300, 0);
    verifyFrameStep(frame2, 20, 300, 20);
    verifyFrameStep(frame3, -30, 300, -10);
  });
});

function verifySetupFrame(
  frame: ArduinoFrame,
  steps: number,
  totalSteps: number,
  currentRotation: number
) {
  expect(frame.explanation).toBe(`Setting up the stepper motor.`);
  verifyFrame(frame, steps, totalSteps, currentRotation);
}

function verifyFrameStep(
  frame: ArduinoFrame,
  steps: number,
  totalSteps: number,
  currentRotation: number
) {
  expect(frame.explanation).toBe(`Stepper motor moving ${steps} steps.`);
  verifyFrame(frame, steps, totalSteps, currentRotation);
}

function verifyFrame(
  frame: ArduinoFrame,
  steps: number,
  totalSteps: number,
  currentRotation: number
) {
  const components = frame.components;
  expect(components.length).toBe(1);
  const [component] = components as StepperMotorState[];
  expect(component.type).toBe(ArduinoComponentType.STEPPER_MOTOR);
  expect(component.pin1).toBe(ARDUINO_PINS.PIN_4);
  expect(component.pin2).toBe(ARDUINO_PINS.PIN_5);
  expect(component.pin3).toBe(ARDUINO_PINS.PIN_6);
  expect(component.pin4).toBe(ARDUINO_PINS.PIN_7);
  expect(component.steps).toBe(steps);
  expect(component.totalSteps).toBe(totalSteps);
  expect(component.currentRotation).toBe(currentRotation);
}
