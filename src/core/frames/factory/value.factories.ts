import { Timeline, ArduinoFrame } from '../arduino.frame';
import { Color } from '../arduino.frame';
import { BlockData } from '../../blockly/state/block.data';
import {
  mathNumber,
  mathArithmetic,
  mathRound,
  mathModulus,
  mathRandom,
  numberToString,
} from './value/math';
import {
  logicBoolean,
  logicCompare,
  logicOperation,
  logicNot,
} from './value/logic';
import {
  text,
  textJoin,
  textLength,
  textParse,
  textIsEmpty,
  changeCase,
  numberToText,
} from './value/text';
import { VariableData } from '../../blockly/state/variable.data';
import { colorPicker, randomColor, rgbColor } from './value/colors';
import { findBlockInput } from './factory.helpers';
import _ from 'lodash';
import { getVariable } from './value/get_variables';
import { getItemInList } from './value/list-get-item';
import { getArduinoMessage, arduinoHasMessage } from './value/message';
import { timeSeconds } from './value/time_seconds';
import { hasBtMessage, getBtMessage } from './value/bluetooth';
import { getPinState } from './value/pin';
import { isButtonPressed } from './value/button';
import { irRemoteHasCode, irRemoteGetCode } from './value/ir_remote';
import { ultraSonicSensorDistance } from './value/ultra_sonic_sensor';
import { rfidScannedCard, rfidCardNumber, rfidTag } from './value/rfid';
import { getHumidity, getTemp } from './value/temp';

export interface ValueGenerator {
  (
    blocks: BlockData[],
    currentBlock: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    previousState?: ArduinoFrame
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
  analog_read: getPinState('analog_read_setup'),

  is_button_pressed: isButtonPressed,

  ir_remote_get_code: irRemoteGetCode,
  ir_remote_has_code_receive: irRemoteHasCode,

  ultra_sonic_sensor_motion: ultraSonicSensorDistance,

  rfid_scan: rfidScannedCard,
  rfid_card: rfidCardNumber,
  rfid_tag: rfidTag,

  temp_get_humidity: getHumidity,
  temp_get_temp: getTemp,
};

export const getInputValue = (
  blocks: BlockData[],
  block: BlockData,
  variables: VariableData[],
  timeline: Timeline,
  inputName: string,
  defaultValue: any,
  previousState: ArduinoFrame = undefined
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
