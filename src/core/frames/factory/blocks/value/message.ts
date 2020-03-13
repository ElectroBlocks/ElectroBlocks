import { ValueGenerator } from '../../value.factories';
import { BluetoothSensor } from '../../../../blockly/state/sensors.state';
import { getSensorForLoop } from '../../factory.helpers';

export const getArduinoMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const loopSensorData = getSensorForLoop<BluetoothSensor>(
    blocks,
    timeline,
    'message_setup'
  );

  return loopSensorData.message;
};

export const arduinoHasMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const loopSensorData = getSensorForLoop<BluetoothSensor>(
    blocks,
    timeline,
    'message_setup'
  );

  return loopSensorData.receiving_message;
};
