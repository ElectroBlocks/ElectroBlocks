import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  findComponent,
  getDefaultIndexValue,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { MotorShieldState } from "./state";
import { MOTOR_DIRECTION } from "./state";

export const motorSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const numberOfMotors =
    findFieldValue(block, "NUMBER_OF_COMPONENTS") == "1" ? 1 : 2;
  const en1 = findFieldValue(block, "PIN_EN1");
  const in1 = findFieldValue(block, "PIN_IN1");
  const in2 = findFieldValue(block, "PIN_IN2");
  const en2 = findFieldValue(block, "PIN_EN2");
  const in3 = findFieldValue(block, "PIN_IN3");
  const in4 = findFieldValue(block, "PIN_IN4");
  const motorShieldState: MotorShieldState = {
    numberOfMotors,
    en1,
    in1,
    in2,
    en2: null,
    in3: null,
    in4: null,
    direction1: MOTOR_DIRECTION.CLOCKWISE,
    direction2: MOTOR_DIRECTION.CLOCKWISE,
    speed1: 0,
    speed2: 0,
    pins: [en1, in1, in2],
    type: ArduinoComponentType.MOTOR,
  };

  if (numberOfMotors === 2) {
    motorShieldState.en2 = en2;
    motorShieldState.in3 = in3;
    motorShieldState.in4 = in4;
    motorShieldState.pins.push(in4);
    motorShieldState.pins.push(in3);
    motorShieldState.pins.push(en2);
  }

  var message =
    motorShieldState.numberOfMotors == 1
      ? "Setting up 1 motor with a motor shield"
      : "Setting up 2 motors with a motor shield.";

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      motorShieldState,
      message,
      previousState
    ),
  ];
};

export const stopMotor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const motorShieldStateToUpdate = {
    ...findComponent<MotorShieldState>(
      previousState,
      ArduinoComponentType.MOTOR
    ),
  };
  const motorNumber = +findFieldValue(block, "MOTOR");
  let actualMotorNumber = 1;
  if (motorShieldStateToUpdate.numberOfMotors === 1 || motorNumber === 1) {
    motorShieldStateToUpdate.speed1 = 0;
  } else {
    motorShieldStateToUpdate.speed2 = 0;
    actualMotorNumber = 2;
  }

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      motorShieldStateToUpdate,
      `Stopping motor ${actualMotorNumber}.`,
      previousState
    ),
  ];
};

export const moveMotor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const motorShieldStateToUpdate = {
    ...findComponent<MotorShieldState>(
      previousState,
      ArduinoComponentType.MOTOR
    ),
  };
  const motorNumber = +findFieldValue(block, "MOTOR");

  const speed = getDefaultIndexValue(
    0,
    4000,
    getInputValue(blocks, block, variables, timeline, "SPEED", 1, previousState)
  );

  const direction = findFieldValue(block, "DIRECTION") as MOTOR_DIRECTION;
  let actualMotorNumber = 1;
  if (motorShieldStateToUpdate.numberOfMotors === 1 || motorNumber === 1) {
    motorShieldStateToUpdate.direction1 = direction;
    motorShieldStateToUpdate.speed1 = speed;
  } else {
    motorShieldStateToUpdate.direction2 = direction;
    motorShieldStateToUpdate.speed2 = speed;
    actualMotorNumber = 2;
  }

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      motorShieldStateToUpdate,
      `Motor ${actualMotorNumber} moves ${direction
        .toLowerCase()
        .replace("_", "")} at speed ${speed}.`,
      previousState
    ),
  ];
};
