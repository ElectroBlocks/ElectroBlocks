import { StateGenerator } from '../../state.factories';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import {
  PinState,
  PIN_TYPE,
  pinPictureToWork as pinPictureToWord,
} from '../../../arduino-components.state';
import { ArduinoComponentType } from '../../../arduino.frame';
import { PinSensor } from '../../../../blockly/state/sensors.state';
import { arduinoStateByComponent } from '../../factory.helpers';

export const setupReadPin: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pictureType = findFieldValue(block, 'TYPE');
  const [pin] = block.pins;
  const sensorData = JSON.parse(block.metaData) as PinSensor[];
  const pinType =
    block.blockName === 'digital_read_setup'
      ? PIN_TYPE.DIGITAL_INPUT
      : PIN_TYPE.ANALOG_INPUT;

  const pinState = sensorData.find((s) => s.loop === 1);

  const setupState: PinState = {
    type: ArduinoComponentType.PIN,
    state: pinState.state,
    pin: pin,
    pins: block.pins,
    pinPicture: pictureType,
    pinType,
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      setupState,
      `Setting up ${pinPictureToWord(pictureType)}.`,
      previousState
    ),
  ];
};
