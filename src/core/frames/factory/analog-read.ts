import { StateGenerator } from './state.factories';
import { findFieldValue } from '../../blockly/helpers/block-data.helper';
import { PinState, PIN_TYPE, pinPictureToWork as pinPictureToWord } from '../state/arduino-components.state';
import { ArduinoComponentType } from '../state/arduino.state';
import { getSensorData } from '../../blockly/transformers/sensor-data.transformer';
import { PinSensor } from '../../blockly/state/sensors.state';
import { createArduinoState } from './factory.helpers';

export const analogReadSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const pictureType = findFieldValue(block, 'TYPE');
  const [pin] = block.pins;
  const sensorData = getSensorData(blocks);
  const pinState = sensorData.find(
    // loop should always be 1 because it's a pre setup block
    // Meaning it's never in the loop or setup
    (s) => s.blockName === block.blockName && s.loop === 1
  ) as PinSensor;


  const analogReadState: PinState = {
    type: ArduinoComponentType.PIN,
    state: pinState.state,
    pin: pin,
    pins: block.pins,
    pinPicture: pictureType,
    pinType: PIN_TYPE.ANALOG_INPUT
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      analogReadState,
      `Setting up ${pinPictureToWord(pictureType)}.`,
      previousState
    )
  ]; 

};
