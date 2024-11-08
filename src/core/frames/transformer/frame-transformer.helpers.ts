import type {
  ArduinoFrame,
  Timeline,
  ArduinoComponentState,
  Variable,
  Color,
  ArduinoComponentType,
} from "../arduino.frame";

import { arduinoComponentStateToId } from "../arduino-component-id";

import _ from "lodash";
import type { BlockData, PinCategory } from "../../blockly/dto/block.type";
import { findBlockById } from "../../blockly/helpers/block-data.helper";
import { VariableTypes } from "../../blockly/dto/variable.type";
import type { ARDUINO_PINS } from "../../microcontroller/selectBoard";

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
    sendMessage: "",
    timeLine: { ...timeline },
    variables,
    txLedOn,
    builtInLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true,
    frameNumber: previousFrame ? previousFrame.frameNumber + 1 : 1,
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
    sendMessage: "",
    timeLine: { ...timeline },
    variables,
    txLedOn,
    builtInLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true,
    frameNumber: previousFrame ? previousFrame.frameNumber + 1 : 1,
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
    ...previousComponents.filter(
      (c) =>
        arduinoComponentStateToId(c) !== arduinoComponentStateToId(newComponent)
    ),
    newComponent,
  ];

  return {
    blockId,
    blockName,
    sendMessage: "",
    timeLine: { ...timeline },
    variables,
    txLedOn,
    builtInLedOn: builtInLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true,
    frameNumber: previousFrame ? previousFrame.frameNumber + 1 : 1,
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
      return "";
    case VariableTypes.BOOLEAN:
      return true;
    case VariableTypes.NUMBER:
      return 0;
    default:
      return undefined;
  }
};

export const getDefaultValueList = (type: VariableTypes) => {
  switch (type) {
    case VariableTypes.COLOUR:
      return { red: 0, green: 0, blue: 0 };
    case VariableTypes.STRING:
      return "";
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
      ? `(red=${color.red},green=${color.green},blue=${color.blue})`
      : "(red=0,green=0,blue=0)";
  }

  if (type === VariableTypes.STRING) {
    return `"${value}"`;
  }

  return value;
};

export const findComponent = <T extends ArduinoComponentState>(
  state: ArduinoFrame,
  type: ArduinoComponentType,
  pin: ARDUINO_PINS = undefined
) => {
  if (pin !== undefined) {
    return state.components.find(
      (c) => c.type === type && c.pins.includes(pin)
    ) as T;
  }

  return state.components.find((c) => c.type === type) as T;
};
