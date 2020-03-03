import { BlockEvent } from '../blockly/state/event.data';
import { ArduinoState, Timeline } from './state/arduino.state';
import { BlockType } from '../blockly/state/block.data';
import { generateState } from './factory/state.factories';
import _ from 'lodash';
import {
  getLoopTimeFromBlockData,
  findArduinoLoopBlock
} from '../blockly/helpers/block-data.helper';
import { generateInputState } from './factory/factory.helpers';

export const eventToFrameFactory = (event: BlockEvent): ArduinoState[] => {
  const { blocks } = event;

  const preSetupBlockType = [
    BlockType.SENSOR_SETUP,
    BlockType.SETUP,
    BlockType.LIST_CREATE
  ];

  const preSetupBlocks = blocks.filter((b) =>
    preSetupBlockType.includes(b.type)
  );

  const preSetupStates = preSetupBlocks.reduce((prevStates, block) => {
    const previousState =
      prevStates.length === 0
        ? undefined
        : _.cloneDeep(prevStates[prevStates.length - 1]);

    return [
      ...prevStates,
      ...generateState(
        blocks,
        block,
        event.variables,
        { iteration: 0, function: 'pre-setup' },
        previousState
      )
    ];
  }, []);

  const arduinoLoopBlock = findArduinoLoopBlock(blocks);
  const loopTimes = getLoopTimeFromBlockData(blocks);

  return _.range(1, loopTimes + 1).reduce((prevStates, loopTime) => {
    const previousState =
      prevStates.length === 0
        ? undefined
        : _.cloneDeep(prevStates[prevStates.length - 1]);
    const timeLine: Timeline = { iteration: loopTime, function: 'loop' };
    return [
      ...prevStates,
      ...generateInputState(
        arduinoLoopBlock,
        blocks,
        event.variables,
        timeLine,
        'loop',
        previousState
      )
    ];
  }, preSetupStates);
};

