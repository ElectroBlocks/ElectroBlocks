import { BlockData } from '../../blockly/state/block.data';
import { Timeline, ArduinoState } from '../state/arduino.state';
import { rfidSetup } from './blocks/state/rfid';
import { bluetoothSetup } from './blocks/state/bluetooth';
import { messageSetup, arduinoSendMessage } from './blocks/state/message';
import { timeSetup } from './blocks/state/time';
import { lcdScreenSetup } from './blocks/state/lcd';
import { neoPixelSetup } from './blocks/state/neopixel';
import { ledColorSetup } from './blocks/state/led-color';
import { setupReadPin } from './blocks/state/pin';
import { buttonSetup } from './blocks/state/button';
import { irRemoteSetup } from './blocks/state/ir_remote';
import { debugBlock } from './blocks/state/debug';
import { ultraSonicSensor } from './blocks/state/ultra_sonic_sensor';
import { tempSetupSensor } from './blocks/state/temp_setup';
import { VariableData } from '../../blockly/state/variable.data';
import {
  createListNumberState,
  createListStringState,
  createListBoolState,
  createListColorState,
  setStringInList,
  setNumberInList,
  setColorInList,
  setBooleanInList
} from './blocks/state/list';
import { setVariable } from './blocks/state/set_variables';
import { ifElse } from './blocks/state/logic';
import { simpleLoop, forLoop } from './blocks/state/loop';
import { customBlock } from './blocks/state/function';

export interface StateGenerator {
  (
    blocks: BlockData[],
    block: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    previousState?: ArduinoState
  ): ArduinoState[];
}

const stateList: { [blockName: string]: StateGenerator } = {
  rfid_setup: rfidSetup,
  bluetooth_setup: bluetoothSetup,
  message_setup: messageSetup,
  time_setup: timeSetup,
  lcd_setup: lcdScreenSetup,
  neo_pixel_setup: neoPixelSetup,
  led_color_setup: ledColorSetup,
  analog_read_setup: setupReadPin,
  digital_read_setup: setupReadPin,
  button_setup: buttonSetup,
  ir_remote_setup: irRemoteSetup,
  ultra_sonic_sensor_setup: ultraSonicSensor,
  temp_setup: tempSetupSensor,
  create_list_number_block: createListNumberState,
  create_list_string_block: createListStringState,
  create_list_boolean_block: createListBoolState,
  create_list_colour_block: createListColorState,
  set_string_list_block: setStringInList,
  set_boolean_list_block: setBooleanInList,
  set_colour_list_block: setColorInList,
  set_number_list_block: setNumberInList,
  variables_set_number: setVariable,
  variables_set_string: setVariable,
  variables_set_boolean: setVariable,
  variables_set_colour: setVariable,
  debug_block: debugBlock,
  control_if: ifElse,
  controls_ifelse: ifElse,

  controls_repeat_ext: simpleLoop,
  controls_for: forLoop,
  procedures_callnoreturn: customBlock,

  arduino_send_message: arduinoSendMessage
};

export const generateState: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  try {
    return stateList[block.blockName](
      blocks,
      block,
      variables,
      timeline,
      previousState
    );
  } catch (e) {
    console.log(block.blockName, 'block name');
    throw e;
  }
};
