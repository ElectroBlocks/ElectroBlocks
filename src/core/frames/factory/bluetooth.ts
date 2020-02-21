import { StateGenerator } from './state.factories';
import { BluetoothSensor } from '../../blockly/state/sensors.state';
import { BluetoothState } from '../state/arduino-components.state';
import { ArduinoComponentType } from '../state/arduino.state';
import { createArduinoState } from './factory.helpers';
import { findFieldValue } from '../../blockly/helpers/block-data.helper';


export const bluetoothSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const btSensorDatum = JSON.parse(block.metaData) as BluetoothSensor[];
  const btSensor = btSensorDatum.find(d => d.loop === 1);

  const bluetoothComponent: BluetoothState = {
    pins: block.pins,
    type: ArduinoComponentType.BLUE_TOOTH,
    rxPin: findFieldValue(block,'RX'),
    txPin: findFieldValue(block,'TX'),
    hasMessage: btSensor.receiving_message,
    message: btSensor.message,
    sendMessage: ''
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      bluetoothComponent,
      'Setting up Bluetooth.',
      previousState
    )
  ];


}
