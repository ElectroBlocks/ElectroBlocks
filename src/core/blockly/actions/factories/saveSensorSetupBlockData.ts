import { BlockEvent } from '../../state/event.data';
import { SaveSetupSensorData, ActionType } from '../actions';
import { BlockType } from '../../state/block.data';
import _ from 'lodash';
import { convertToSensorData } from '../../transformers/sensor-data.transformer';
import { getLoopTimeFromBlockData } from '../../helpers/block-data.helper';

export const saveSensorSetupBlockData = (
  event: BlockEvent
): SaveSetupSensorData[] => {
  const { fieldName, blockId, blocks, fieldType } = event;

  if (fieldName == 'LOOP' && fieldType === 'field') {
    return [];
  }

  const block = blocks.find((b) => b.id == blockId);

  if (!block || block.type !== BlockType.SENSOR_SETUP) {
    return [];
  }

  const executionTimes = getLoopTimeFromBlockData(blocks);
  const loopTimes = _.range(1, executionTimes + 1);
  const sensorData = convertToSensorData(block);
  if (!_.isEmpty(block.metaData)) {
    const metadata = JSON.parse(block.metaData);
    const newMetadata = [
      ...metadata.filter((b) => b.loop !== sensorData.loop),
      sensorData
    ];
    return [
      {
        blockId: block.id,
        data: JSON.stringify(newMetadata),
        type: ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA
      }
    ];
  }

  const metadata = loopTimes.map((i) => {
    return { ...sensorData, loop: i };
  });

  return [
    {
      blockId: block.id,
      data: JSON.stringify(metadata),
      type: ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA
    }
  ];
};
