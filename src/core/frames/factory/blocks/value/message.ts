import { ValueGenerator } from '../../value.factories';
import { convertToSensorData } from '../../../../blockly/transformers/sensor-data.transformer';
import { BluetoothSensor } from '../../../../blockly/state/sensors.state';
import { BlockData } from '../../../../blockly/state/block.data';
import { Timeline } from '../../../state/arduino.state';

export const getArduinoMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const loopSensorData = getSensorForLoop(blocks, timeline);

  return loopSensorData.message;
};

export const arduinoHasMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const loopSensorData = getSensorForLoop(blocks, timeline);

  return loopSensorData.receiving_message;
};

const getSensorForLoop = (blocks: BlockData[], timeline: Timeline) => {
  const setupBlock = blocks.find((b) => b.blockName === 'message_setup');

  const sensorData = JSON.parse(setupBlock.metaData) as BluetoothSensor[];

  return sensorData.find((s) => s.loop === timeline.iteration);
};
