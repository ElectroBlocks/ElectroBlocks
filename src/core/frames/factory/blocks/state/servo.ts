import { StateGenerator } from '../../state.factories';
import {
  getDefaultIndexValue,
  findComponent,
  arduinoStateByComponent,
} from '../../factory.helpers';
import { getInputValue } from '../../value.factories';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { ArduinoFrame, ArduinoComponentType } from '../../../arduino.frame';
import { ServoState } from '../../../state/arduino-components.state';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';

export const servoRotate: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const degree = getDefaultIndexValue(
    0,
    5000,
    getInputValue(
      blocks,
      block,
      variables,
      timeline,
      'DEGREE',
      1,
      previousState
    )
  );

  const newComponent = getServo(
    degree,
    findFieldValue(block, 'PIN'),
    previousState
  );

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Servo ${newComponent.pins[0]} is rotating to ${newComponent.degree} degrees.`,
      previousState
    ),
  ];
};

const getServo = (
  degree: number,
  pin: ARDUINO_UNO_PINS,
  previousState: ArduinoFrame
): ServoState => {
  if (!previousState) {
    return { pins: [pin], degree, type: ArduinoComponentType.SERVO };
  }

  const servo = findComponent<ServoState>(
    previousState,
    ArduinoComponentType.SERVO,
    pin
  );

  if (!servo) {
    return { pins: [pin], degree, type: ArduinoComponentType.SERVO };
  }

  return { ...servo, degree };
};
