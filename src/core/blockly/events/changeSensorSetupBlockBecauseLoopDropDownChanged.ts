import _ from 'lodash';
import { getBlockById } from '../helpers/block.helper';
import { sensorSetupBlocks } from './disableEnableBlocks';

// This is fired when a sensor block changes the loop drop down box so that
export const changeSensorSetupBlockBecauseLoopDropDownChanged = (event) => {
  if (
    event.name === 'LOOP' &&
    event.element === 'field' &&
    _.isEmpty(event.newValue) &&
    _.isEmpty(event.blockId)
  ) {
    return;
  }

  const block = getBlockById(event.blockId);

  // Make sure the block exists
  if (!block) {
    return;
  }

  // only save sensor setup blocks
  if (!sensorSetupBlocks.includes(block.type) || _.isEmpty(block.data)) {
    return;
  }

  // New Value is the new value
  const loopNumber = +event.newValue;
  const sensorData = JSON.parse(block.data) as any[];

  const sensorDataForLoop = sensorData.find((data) => data.loop === loopNumber);

  if (_.isEmpty(sensorDataForLoop)) {
    return;
  }

  Object.keys(sensorDataForLoop)
    .filter((key) => key !== 'loop')
    .forEach((key) => {
      block.getField(key).setValue(sensorDataForLoop[key]);
    });
};
