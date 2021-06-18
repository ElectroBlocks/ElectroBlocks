import type { Timeline, ArduinoFrame } from "../arduino.frame";
import type { Color } from "../arduino.frame";
import type { BlockData } from "../../blockly/dto/block.type";
import {
  mathNumber,
  mathArithmetic,
  mathRound,
  mathModulus,
  mathRandom,
  numberToString,
  mathNumberProperty,
} from "../../../blocks/math/blocktovalue";
import {
  logicBoolean,
  logicCompare,
  logicOperation,
  logicNot,
} from "../../../blocks/logic/blocktovalue";
import { getItemInList } from "../../../blocks/list/blocktovalue";
import {
  text,
  textJoin,
  textLength,
  textParse,
  textIsEmpty,
  changeCase,
  numberToText,
} from "../../../blocks/text/blocktovalue";
import type { VariableData } from "../../blockly/dto/variable.type";
import {
  colorPicker,
  randomColor,
  rgbColor,
} from "../../../blocks/color/blocktovalue";
import { findBlockInput } from "./frame-transformer.helpers";
import _ from "lodash";
import {
  rfidScannedCard,
  rfidCardNumber,
  rfidTag,
} from "../../../blocks/rfid/blocktovalue";
import { getHumidity, getTemp } from "../../../blocks/temperature/blocktovalue";
import {
  getBtMessage,
  hasBtMessage,
} from "../../../blocks/bluetooth/blocktovalue";
import { isButtonPressed } from "../../../blocks/button/blocktovalue";
import {
  irRemoteGetCode,
  irRemoteHasCode,
} from "../../../blocks/ir_remote/blocktovalue";
import { digitalRead } from "../../../blocks/digitalsensor/blocktovalue";
import { analogRead } from "../../../blocks/analogsensor/blocktovalue";
import { timeSeconds } from "../../../blocks/time/blocktovalue.time_seconds";
import {
  arduinoHasMessage,
  getArduinoMessage,
} from "../../../blocks/message/blocktovalue";
import { ultraSonicSensorDistance } from "../../../blocks/ultrasonic_sensor/blocktovalue";
import { getVariable } from "../../../blocks/variables/blocktovalue";

import { thermistorRead } from "../../../blocks/thermistor/blocktovalue";
import {
  joystickAngle,
  joystickButton,
  joystickEngaged,
} from "../../../blocks/joystick/blocktovalue";

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
  math_number_property: mathNumberProperty,

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

  color_picker_custom: colorPicker,
  colour_random: randomColor,
  colour_rgb: rgbColor,

  arduino_get_message: getArduinoMessage,
  arduino_receive_message: arduinoHasMessage,

  time_seconds: timeSeconds,

  bluetooth_has_message: hasBtMessage,
  bluetooth_get_message: getBtMessage,

  digital_read: digitalRead,
  analog_read: analogRead,

  is_button_pressed: isButtonPressed,

  ir_remote_get_code: irRemoteGetCode,
  ir_remote_has_code_receive: irRemoteHasCode,

  ultra_sonic_sensor_motion: ultraSonicSensorDistance,

  rfid_scan: rfidScannedCard,
  rfid_card: rfidCardNumber,
  rfid_tag: rfidTag,

  temp_get_humidity: getHumidity,
  temp_get_temp: getTemp,

  thermistor_read: thermistorRead,

  joystick_angle: joystickAngle,
  joystick_button: joystickButton,
  joystick_engaged: joystickEngaged,
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
  const value = blockToValue(
    blocks,
    inputBlock,
    variables,
    timeline,
    previousState
  );

  return value === undefined ? defaultValue : value;
};

export const blockToValue: ValueGenerator = (
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
