import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  findComponent,
} from "../../core/frames/transformer/frame-transformer.helpers";
import { StepperMotorState } from "./state";

export const stepperMotorSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousFrame
) => {
  const pin1 = findFieldValue(block, "PIN_1");
  const pin2 = findFieldValue(block, "PIN_2");
  const pin3 = findFieldValue(block, "PIN_3");
  const pin4 = findFieldValue(block, "PIN_4");
  const totalSteps = findFieldValue(block, "TOTAL_STEPS");
  const stepperMotorState: StepperMotorState = {
    type: ArduinoComponentType.STEPPER_MOTOR,
    pins: [pin1, pin2, pin3, pin4],
    pin1,
    pin2,
    pin3,
    pin4,
    currentRotation: 0,
    totalSteps,
    steps: 0,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      stepperMotorState,
      `Setting up the stepper motor.`,
      previousFrame
    ),
  ];
};

export const moveStepperMotor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previosState
) => {
  const steps = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "STEPS",
    0,
    previosState
  );
  const stepperMotorState = findComponent(
    previosState,
    ArduinoComponentType.STEPPER_MOTOR
  ) as StepperMotorState;
  const updatedComponent: StepperMotorState = {
    ...stepperMotorState,
    steps,
    currentRotation: stepperMotorState.currentRotation + steps,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      updatedComponent,
      `Stepper motor moving ${steps} steps.`,
      previosState
    ),
  ];
};
