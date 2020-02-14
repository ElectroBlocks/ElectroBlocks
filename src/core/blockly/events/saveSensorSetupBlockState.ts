import { getBlockById } from '../helpers/block.helper';
import _ from 'lodash';
import { sensorStates } from '../../state-generator/sensor-data.generator';
import { BlockSvg } from 'blockly';
import { SensorData } from '../../arduino-state/sensors.state';
import { sensorSetupBlocks } from '../helpers/block.contants';

export const saveSensorSetupBlockState = (event) => {
  if (!processEvent(event)) {
    return;
  }

  const block = getBlockById(event.blockId);

  const newDataToSave = createData(block);

  block.data = JSON.stringify(newDataToSave);
};

const createData = (block: BlockSvg) => {
  const loopSensorData = sensorStates(block);
  if (_.isEmpty(block.data)) {
    return loopSensorData;
  }
  const savedData = JSON.parse(block.data) as SensorData[];
  const currentLoop = +block.getFieldValue('LOOP');

  return loopSensorData.map((possibleReplace) => {
    if (currentLoop === possibleReplace.loop) {
      return possibleReplace;
    }

    const savedLoopData = savedData.find(
      (data) => data.loop === possibleReplace.loop
    );

    return savedLoopData || possibleReplace;
  });
};

const processEvent = (event) => {
  // If the loop field is changing don't save anything
  // This means that they are changing the loop drop down box
  if (event.name === 'LOOP' && event.element === 'field') {
    return false;
  }

  const block = getBlockById(event.blockId);
  // If the block does not exist
  if (!block) {
    return false;
  }

  // only save sensor setup blocks
  if (!sensorSetupBlocks.includes(block.type)) {
    return false;
  }

  return true;
};
