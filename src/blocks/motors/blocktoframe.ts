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


export const MotorSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const motorNumber = getDefaultIndexValue(
    1,
    2,
    parseInt(getInputValue(blocks, block, variables, timeline, "MOTOR", 1, previousState))
  );
  const pin1 = getDefaultIndexValue(
    2,
    13,
    parseInt(getInputValue(blocks, block, variables, timeline, "PIN_1", 3, previousState))
  ); 
  const pin2 = getDefaultIndexValue(
    2,
    13,
    parseInt(getInputValue(blocks, block, variables, timeline, "PIN_2", 3, previousState))
  ); 

  const motorState = getMotorState(
    previousState,
    findFieldValue(block, "MOTOR"),
    0, // Assuming initial speed is 0
    findFieldValue(block, "PIN_1"),
    findFieldValue(block, "PIN_2"),
    null // Assuming no direction is set during setup
  );

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      motorState,
      `Motor ${motorState.motorNumber} setup with pins ${motorState.PIN_1} and ${motorState.PIN_2}.`,
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
  const speed = getDefaultIndexValue(
    0,
    4000,
    getInputValue(blocks, block, variables, timeline, "SPEED", 1, previousState)
  );

  const direction = findFieldValue(block, "DIRECTION");

  const motorState = getMotorState(
    previousState,
    findFieldValue(block, "MOTOR"),
    speed,
    null, // Assuming pin values are not needed here
    null, // Assuming pin values are not needed here
    direction
  );

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      motorState,
      `Motor ${motorState.motorNumber} moves ${motorState.direction.toLowerCase()} at speed ${motorState.speed}.`,
      previousState
    ),
  ];
};


const getMotorState = (
  frame: ArduinoFrame,
  motorNumber: string,
  speed: number,
  PIN_1: number,
  PIN_2: number,
  direction: MOTOR_DIRECTION
): MotorState => {
  if (!frame) {
    return {
      pins: [],
      type: ArduinoComponentType.MOTOR,
      direction,
      speed,
      PIN_1,
      PIN_2,
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
      PIN_1,
      PIN_2,
      motorNumber,
    };
  }

  return { ...motorState, direction, speed, motorNumber, PIN_1, PIN_2};
};

const findComponent = (frame: ArduinoFrame, motorNumber: string) => {
  return frame.components.find(
    (c) =>
      c.type === ArduinoComponentType.MOTOR &&
      (<MotorState>c).motorNumber === motorNumber
  ) as MotorState;
};
