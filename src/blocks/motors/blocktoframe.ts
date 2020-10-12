import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  getDefaultIndexValue,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { MotorState } from "./state";
import type { MOTOR_DIRECTION } from "./state";

export const moveMotor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const motorNumber = getDefaultIndexValue(
    1,
    4,
    getInputValue(blocks, block, variables, timeline, "MOTOR", 1, previousState)
  );

  const speed = getDefaultIndexValue(
    1,
    4000,
    getInputValue(blocks, block, variables, timeline, "SPEED", 1, previousState)
  );

  const motorState = getMotorState(
    previousState,
    motorNumber,
    speed,
    findFieldValue(block, "DIRECTION")
  );

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      motorState,
      `Motor ${
        motorState.motorNumber
      } moves ${motorState.direction.toLowerCase()} at speed ${
        motorState.speed
      }.`,
      previousState
    ),
  ];
};

const getMotorState = (
  frame: ArduinoFrame,
  motorNumber: number,
  speed: number,
  direction: MOTOR_DIRECTION
): MotorState => {
  if (!frame) {
    return {
      pins: [],
      type: ArduinoComponentType.MOTOR,
      direction,
      speed,
      motorNumber,
    };
  }

  const motorState = findComponent(frame, motorNumber);

  if (!motorState) {
    return {
      pins: [],
      type: ArduinoComponentType.MOTOR,
      direction,
      speed,
      motorNumber,
    };
  }

  return { ...motorState, direction, speed, motorNumber };
};

const findComponent = (frame: ArduinoFrame, motorNumber: number) => {
  return frame.components.find(
    (c) =>
      c.type === ArduinoComponentType.MOTOR &&
      (<MotorState>c).motorNumber === motorNumber
  ) as MotorState;
};
