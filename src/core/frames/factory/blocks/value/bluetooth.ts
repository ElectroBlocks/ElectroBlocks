import { BluetoothSensor } from '../../../../blockly/state/sensors.state';
import { getSensorForLoop } from '../../factory.helpers';
import { ValueGenerator } from '../../value.factories';

export const getBtMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return getSensorForLoop<BluetoothSensor>(blocks, timeline, 'bluetooth_setup')
    .message;
};

export const hasBtMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return getSensorForLoop<BluetoothSensor>(blocks, timeline, 'bluetooth_setup')
    .receiving_message;
};
