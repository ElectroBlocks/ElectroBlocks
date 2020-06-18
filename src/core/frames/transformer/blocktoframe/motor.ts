import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { getInputValue } from '../block-to-value.factories';
import {
  getDefaultIndexValue,
  findComponent,
  arduinoFrameByComponent,
} from '../frame-transformer.helpers';
import { MotorState, MOTOR_DIRECTION } from '../../arduino-components.state';
import { ArduinoFrame, ArduinoComponentType } from '../../arduino.frame';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

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
    getInputValue(blocks, block, variables, timeline, 'MOTOR', 1, previousState)
  );

  const speed = getDefaultIndexValue(
    1,
    4000,
    getInputValue(blocks, block, variables, timeline, 'SPEED', 1, previousState)
  );

  const motorState = getMotorState(
    previousState,
    motorNumber,
    speed,
    findFieldValue(block, 'DIRECTION')
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
  state: ArduinoFrame,
  motorNumber: number,
  speed: number,
  direction: MOTOR_DIRECTION
): MotorState => {
  if (!state) {
    return {
      pins: [],
      type: ArduinoComponentType.MOTOR,
      direction,
      speed,
      motorNumber,
    };
  }

  const motorState = findComponent<MotorState>(
    state,
    ArduinoComponentType.MOTOR,
    undefined,
    motorNumber
  );

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
