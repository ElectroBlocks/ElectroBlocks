import {
  ArduinoState,
  Timeline,
  ArduinoComponentState,
  Variable,
  Color
} from '../state/arduino.state';

import _ from 'lodash';
import { BlockData } from '../../blockly/state/block.data';
import { findBlockById, findInputStatementStartBlock } from '../../blockly/helpers/block-data.helper';
import { VariableTypes, VariableData } from '../../blockly/state/variable.data';
import { generateState } from './state.factories';

export const arduinoStateByVariable = (
  blockId: string,
  timeline: Timeline,
  newVariable: Variable,
  explanation: string,
  previousState: ArduinoState = undefined,
  txLedOn = false,
  rxLedOn = false,
  delay = 0
) => {
  const variables = previousState ? _.cloneDeep(previousState.variables) : {};
  variables[newVariable.name] = newVariable;

  const components = previousState ? _.cloneDeep(previousState.components) : [];

  return {
    blockId,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    rxLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true
  };
};

export const findBlockInput = (
  blocks: BlockData[],
  block: BlockData,
  inputName: string
) => {
  const input = block.inputBlocks.find((i) => i.name == inputName);
  if (!input || !input.blockId) {
    return undefined;
  }

  return findBlockById(blocks, input.blockId);
};

export const arduinoStateByExplanation = (blockId: string,
  timeline: Timeline,
  explanation: string,
  previousState: ArduinoState = undefined,
  txLedOn = false,
  rxLedOn = false,
  delay = 0
) => {

  const components = previousState ? _.cloneDeep(previousState.components) : [];

  const variables = previousState ? { ...previousState.variables } : {};

  return {
    blockId,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    rxLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true
  };
}

export const arduinoStateByComponent = (
  blockId: string,
  timeline: Timeline,
  newComponent: ArduinoComponentState,
  explanation: string,
  previousState: ArduinoState = undefined,
  txLedOn = false,
  rxLedOn = false,
  delay = 0
): ArduinoState => {
  const variables = previousState ? { ...previousState.variables } : {};
  const previousComponents = previousState ? [...previousState.components] : [];

  const components = [
    ...previousComponents.filter(
      (c) =>
        c.type !== newComponent.type && _.isEqual(c.pins, newComponent.pins)
    ),
    newComponent
  ];

  return {
    blockId,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    rxLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true
  };
};

export const getInputBlock = (
  blocks: BlockData[],
  block: BlockData,
  input: string
) => {
  const blockId = block.inputBlocks.find((i) => i.name == input).blockId;

  return blocks.find((b) => b.id === blockId);
};

export const getDefaultValue = (type: VariableTypes) => {
  switch (type) {
    case VariableTypes.COLOUR:
      return { red: 0, green: 0, blue: 0 };
    case VariableTypes.STRING:
      return '';
    case VariableTypes.BOOLEAN:
      return true;
    case VariableTypes.NUMBER:
      return 1;
    default:
      return undefined;
  }
};

export const getDefaultValueList = (type: VariableTypes) => {
  switch (type) {
    case VariableTypes.COLOUR:
      return { red: 0, green: 0, blue: 0 };
    case VariableTypes.STRING:
      return '';
    case VariableTypes.BOOLEAN:
      return false;
    case VariableTypes.NUMBER:
      return 0;
    default:
      return undefined;
  }
};

export const valueToString = (
  value: Color | string | boolean | number,
  type: VariableTypes
) => {
  if (type === VariableTypes.COLOUR) {
    const color = value as Color;
    return value
      ? `[red=${color.red},green=${color.green},blue=${color.blue}]`
      : '[red=0,green=0,blue=0]';
  }

  if (type === VariableTypes.STRING) {
    return `"${value}"`;
  }

  return value;
};

export const generateInputState = (
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
