import { StateGenerator } from './state.factories';
import {
  ArduinoMessageState,
  BluetoothState
} from '../state/arduino-components.state';
import { getSensorData } from '../../blockly/transformers/sensor-data.transformer';
import { BluetoothSensor } from '../../blockly/state/sensors.state';
import { createArduinoState } from './factory.helpers';
import { ArduinoComponentType } from '../state/arduino.state';

export const messageSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const sensorData = getSensorData(blocks);

  const messageState = sensorData.find(
    // loop should always be 1 because it's a pre setup block
    // Meaning it's never in the loop or setup
    (s) => s.blockName === block.blockName && s.loop === 1
  ) as BluetoothSensor;

  const messageComponent: ArduinoMessageState = {
    pins: block.pins,
    hasMessage: messageState.receiving_message,
    message: messageState.message,
    sendMessage: '',
    type: ArduinoComponentType.MESSAGE
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      messageComponent,
      'Setting up Arduino messages.',
      previousState
    )
  ];
};
