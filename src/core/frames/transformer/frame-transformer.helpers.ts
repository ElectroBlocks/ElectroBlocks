import {
  ArduinoFrame,
  Timeline,
  ArduinoComponentState,
  Variable,
  Color,
  ArduinoComponentType,
} from '../arduino.frame';

import _ from 'lodash';
import { BlockData } from '../../blockly/dto/block.type';
import {
  findBlockById,
  findInputStatementStartBlock,
} from '../../blockly/helpers/block-data.helper';
import { VariableTypes, VariableData } from '../../blockly/dto/variable.type';
import { generateFrame } from './block-to-frame.transformer';
import { Sensor } from '../../blockly/dto/sensors.type';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { MotorState } from '../arduino-components.state';

export const arduinoFrameByVariable = (
  blockId: string,
  blockName: string,
  timeline: Timeline,
  newVariable: Variable,
  explanation: string,
  previousFrame: ArduinoFrame = undefined,
  txLedOn = false,
  builtInLedOn = false,
  delay = 0
): ArduinoFrame => {
  const variables = previousFrame ? _.cloneDeep(previousFrame.variables) : {};
  variables[newVariable.name] = newVariable;
  const components = previousFrame ? _.cloneDeep(previousFrame.components) : [];

  return {
    blockId,
    blockName,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    builtInLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true,
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

export const arduinoFrameByExplanation = (
  blockId: string,
  blockName: string,
  timeline: Timeline,
  explanation: string,
  previousFrame: ArduinoFrame = undefined,
  txLedOn = false,
  builtInLedOn = false,
  delay = 0
): ArduinoFrame => {
  const components = previousFrame ? _.cloneDeep(previousFrame.components) : [];

  const variables = previousFrame ? { ...previousFrame.variables } : {};

  return {
    blockId,
    blockName,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    builtInLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true,
  };
};

export const getDefaultIndexValue = (
  min: number,
  max: number,
  index: number
) => {
  if (index < min) {
    return min;
  }

  if (index > max) {
    return max;
  }

  return index;
};

export const arduinoFrameByComponent = (
  blockId: string,
  blockName: string,
  timeline: Timeline,
  newComponent: ArduinoComponentState,
  explanation: string,
  previousFrame: ArduinoFrame = undefined,
  txLedOn = false,
  builtInLedOn = false,
  delay = 0
): ArduinoFrame => {
  const variables = previousFrame ? { ...previousFrame.variables } : {};
  const previousComponents = previousFrame ? [...previousFrame.components] : [];

  const components = [
    ...previousComponents.filter((c) => {
      if (c.type === ArduinoComponentType.MOTOR) {
        return !(
          c.type === newComponent.type &&
          (<MotorState>c).motorNumber === (<MotorState>newComponent).motorNumber
        );
      }

      return !(
        c.type === newComponent.type && _.isEqual(c.pins, newComponent.pins)
      );
    }),
    newComponent,
  ];

  return {
    blockId,
    blockName,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    builtInLedOn: builtInLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true,
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

export const generateInputFrame = (
  block: BlockData,
  blocks: BlockData[],
  variables: VariableData[],
  timeline: Timeline,
  inputName: string,
  previousState?: ArduinoFrame
): ArduinoFrame[] => {
  // Fixing memory sharing between objects
  previousState = previousState ? _.cloneDeep(previousState) : undefined;
  const startingBlock = findInputStatementStartBlock(blocks, block, inputName);
  if (!startingBlock) {
    return [];
  }
  const arduinoStates = [];
  let nextBlock = startingBlock;
  do {
    const states = generateFrame(
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

export const findComponent = <T extends ArduinoComponentState>(
  state: ArduinoFrame,
  type: ArduinoComponentType,
  pin: ARDUINO_UNO_PINS = undefined,
  motorNumber: number = undefined
) => {
  if (type === ArduinoComponentType.MOTOR) {
    return state.components.find(
      (c) =>
        c.type === type &&
        (<MotorState>c).motorNumber.toString() === motorNumber.toString()
    ) as T;
  }

  if (
    type === ArduinoComponentType.PIN ||
    type === ArduinoComponentType.SERVO ||
    type === ArduinoComponentType.BUTTON
  ) {
    return state.components.find(
      (c) => c.type === type && c.pins.includes(pin)
    ) as T;
  }

  return state.components.find((c) => c.type === type) as T;
};
