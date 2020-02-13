import { getBlockById } from '../helpers/block.helper';
import { sensorSetupBlocks } from './disableEnableBlocks';
import { BlockSvg } from 'blockly';
import _ from 'lodash';
import { getTimesThroughLoop } from '../helpers/arduino_loop_block.helper';

export const saveSensorSetupBlockState = (event) => {
  // If the loop field is changing don't save anything
  // This means that they are changing the loop drop down box
  if (event.name === 'LOOP' && event.element === 'field') {
    return;
  }

  const block = getBlockById(event.blockId);
  // If the block does not exist
  if (!block) {
    return;
  }

  // only save sensor setup blocks
  if (!sensorSetupBlocks.includes(block.type)) {
    return;
  }

  const loopSensorData = populatedSensorLoopData(block);
  if (_.isEmpty(block.data)) {
    block.data = JSON.stringify(loopSensorData);
    return;
  }
  const savedData = JSON.parse(block.data) as any[];
  const currentLoop = +block.getFieldValue('LOOP');

  const newDataToSave = loopSensorData.map((possibleReplace) => {
    if (currentLoop === possibleReplace.loop) {
      return possibleReplace;
    }

    const savedLoopData = savedData.find(
      (data) => data.loop === possibleReplace.loop
    );

    return savedLoopData || possibleReplace;
  });

  block.data = JSON.stringify(newDataToSave);
};

const populatedSensorLoopData = (block: BlockSvg) => {
  const sensorData = (block as any).sensorData();
  // Reason for +1 is because it does not include end number
  return _.range(1, getTimesThroughLoop() + 1).map((loop) => {
    return {
      ...sensorData,
      loop
    };
  });
};
