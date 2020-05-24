import { BluetoothSensor } from '../../../blockly/dto/sensors.type';
import { findComponent } from '../frame-transformer.helpers';
import { ValueGenerator } from '../block-to-value.factories';
import { BluetoothState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

export const getBtMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<BluetoothState>(
    previousState,
    ArduinoComponentType.BLUE_TOOTH,
    findFieldValue(block, 'PIN')
  ).message;
};

export const hasBtMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<BluetoothState>(
    previousState,
    ArduinoComponentType.BLUE_TOOTH,
    findFieldValue(block, 'PIN')
  ).hasMessage;
};
