import { getTopBlocks } from '../helpers/block.helper';
import {
  isArduinoLoopBlockId,
  getTimesThroughLoop
} from '../helpers/arduino_loop_block.helper';
import _ from 'lodash';
import { sensorSetupBlocks } from '../helpers/block.contants';

export const changeLoopNumberInSensorBlocks = (event) => {
  if (
    event['element'] !== 'field' ||
    event['name'] !== 'LOOP_TIMES' ||
    _.isEmpty(event.blockId) ||
    !isArduinoLoopBlockId(event.blockId)
  ) {
    return;
  }

  const loopTimes = getTimesThroughLoop();

  getTopBlocks()
    .filter((block) => sensorSetupBlocks.includes(block.type))
    .forEach((setupBlock) => {
      if (+setupBlock.getFieldValue('LOOP') > loopTimes) {
        setupBlock.getField('LOOP').setValue(loopTimes.toString());
      }
    });
};
