import { ValueGenerator } from '../../value.factories';
import { convertToSensorData } from '../../../../blockly/transformers/sensor-data.transformer';
import { BluetoothSensor } from '../../../../blockly/state/sensors.state';

export const getArduinoMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const setupBlock = blocks.find((b) => b.blockName === 'message_setup');

  const sensorData = JSON.parse(setupBlock.metaData) as BluetoothSensor[];

  const loopSensorData = sensorData.find((s) => s.loop === timeline.iteration);

  return loopSensorData.message;
};
