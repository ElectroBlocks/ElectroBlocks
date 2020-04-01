import { Timeline, ArduinoState } from '../state/arduino.state';
import { Color } from '../state/arduino.state';
import { BlockData } from '../../blockly/state/block.data';
import {
  mathNumber,
  mathArithmetic,
  mathRound,
  mathModulus,
  mathRandom,
  numberToString
} from './blocks/value/math';
import {
  logicBoolean,
  logicCompare,
  logicOperation,
  logicNot
} from './blocks/value/logic';
import {
  text,
  textJoin,
  textLength,
  textParse,
  textIsEmpty,
  changeCase,
  numberToText
} from './blocks/value/text';
import { VariableData } from '../../blockly/state/variable.data';
import { colorPicker, randomColor, rgbColor } from './blocks/value/colors';
import { findBlockInput } from './factory.helpers';
import _ from 'lodash';
import { getVariable } from './blocks/value/get_variables';
import { getItemInList } from './blocks/value/list-get-item';
import { getArduinoMessage, arduinoHasMessage } from './blocks/value/message';
import { timeSeconds } from './blocks/value/time_seconds';
import { hasBtMessage, getBtMessage } from './blocks/value/bluetooth';
import { getPinState } from './blocks/value/pin';

export interface ValueGenerator {
  (
    blocks: BlockData[],
    currentBlock: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    previousState?: ArduinoState
  ):
    | number
    | string
    | boolean
    | Color
    | number[]
    | string[]
    | boolean[]
    | Color[];
}

export const valueList: { [blockName: string]: ValueGenerator } = {
  math_number: mathNumber,
  math_arithmetic: mathArithmetic,
  math_modulo: mathModulus,
  math_round: mathRound,
  math_random_int: mathRandom,

  logic_boolean: logicBoolean,
  logic_compare: logicCompare,
  logic_operation: logicOperation,
  logic_negate: logicNot,

  variables_get_number: getVariable,
  variables_get_string: getVariable,
  variables_get_boolean: getVariable,
  variables_get_colour: getVariable,

  get_colour_from_list: getItemInList,
  get_string_from_list: getItemInList,
  get_number_from_list: getItemInList,
  get_boolean_from_list: getItemInList,

  string_to_number: numberToString,
  text_join: textJoin,
  text_length: textLength,
  text,
  parse_string_block: textParse,
  text_isEmpty: textIsEmpty,
  number_to_string: numberToText,
  text_changeCase: changeCase,

  colour_picker: colorPicker,
  colour_random: randomColor,
  colour_rgb: rgbColor,

  arduino_get_message: getArduinoMessage,
  arduino_receive_message: arduinoHasMessage,

  time_seconds: timeSeconds,

  bluetooth_has_message: hasBtMessage,
  bluetooth_get_message: getBtMessage,

  digital_read: getPinState('digital_read_setup'),
  analog_read: getPinState('analog_read_setup')
};

export const getInputValue = (
  blocks: BlockData[],
  block: BlockData,
  variables: VariableData[],
  timeline: Timeline,
  inputName: string,
  defaultValue: any,
  previousState: ArduinoState = undefined
) => {
  const inputBlock = findBlockInput(blocks, block, inputName);

  if (!inputBlock) {
    return defaultValue;
  }
  const value = getValue(
    blocks,
    inputBlock,
    variables,
    timeline,
    previousState
  );

  return value === undefined ? defaultValue : value;
};

export const getValue: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  try {
    return valueList[block.blockName](
      blocks,
      block,
      variables,
      timeline,
      previousState
    );
  } catch (e) {
    console.trace();
    console.log(block);

    console.log(e);
    throw e;
  }
};
