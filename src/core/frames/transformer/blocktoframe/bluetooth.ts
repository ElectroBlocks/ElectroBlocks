import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { BluetoothSensor } from '../../../blockly/dto/sensors.data';
import { BluetoothState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';
import { arduinoStateByComponent } from '../frame-transformer.helpers';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { getInputValue } from '../block-to-value.factories';
import _ from 'lodash';

export const bluetoothSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const btSensorDatum = JSON.parse(block.metaData) as BluetoothSensor[];
  const btSensor = btSensorDatum.find((d) => d.loop === 1);

  const bluetoothComponent: BluetoothState = {
    pins: block.pins,
    type: ArduinoComponentType.BLUE_TOOTH,
    rxPin: findFieldValue(block, 'RX'),
    txPin: findFieldValue(block, 'TX'),
    hasMessage: btSensor.receiving_message,
    message: btSensor.message,
    sendMessage: '',
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      bluetoothComponent,
      'Setting up Bluetooth.',
      previousState
    ),
  ];
};

export const bluetoothMessage: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const message = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'MESSAGE',
    '',
    previousState
  );
  const btComponent = previousState.components.find(
    (c) => c.type === ArduinoComponentType.BLUE_TOOTH
  ) as BluetoothState;
  const newComponent = _.cloneDeep(btComponent);
  newComponent.sendMessage = message;

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Sending "${message}" from bluetooth to computer.`,
      previousState
    ),
  ];
};
