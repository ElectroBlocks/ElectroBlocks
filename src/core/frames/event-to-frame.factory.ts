import { BlockEvent } from '../blockly/state/event.data';
import { ArduinoState, Timeline } from './state/arduino.state';
import { BlockType, BlockData } from '../blockly/state/block.data';
import { generateState, StateGenerator } from './factory/state.factories';
import _ from 'lodash';
import {
  getLoopTimeFromBlockData,
  findInputStatementStartBlock,
  findArduinoLoopBlock
} from '../blockly/helpers/block-data.helper';
import { findBlockById } from '../blockly/helpers/block-data.helper';
import { VariableData } from '../blockly/state/variable.data';

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

const generateInputState = (
  block: BlockData,
  blocks: BlockData[],
  variables: VariableData[],
  timeline: Timeline,
  inputName: string,
  previousState?: ArduinoState
): ArduinoState[] => {
  const startingBlock = findInputStatementStartBlock(blocks, block, inputName);
  if (!startingBlock) {
    return [];
  }
  const arduinoStates = [];
  let nextBlock = startingBlock;
  do {
    const states = generateState(
      blocks,
      nextBlock,
      variables,
      timeline,
      previousState
    );
    arduinoStates.push(...states);
    const newPreviousState = states[states.length - 1];
    previousState = _.cloneDeep(newPreviousState);
    nextBlock = findBlockById(blocks, nextBlock.nextBlockId);
  } while (nextBlock !== undefined);

  return arduinoStates;
};
