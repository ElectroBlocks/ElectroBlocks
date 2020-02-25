import { BlockData } from '../../blockly/state/block.data';
import { Timeline, ArduinoState } from '../state/arduino.state';
import { rfidSetup } from './blocks/rfid';
import { bluetoothSetup } from './blocks/bluetooth';
import { messageSetup } from './blocks/message';
import { timeSetup } from './blocks/time';
import { lcdScreenSetup } from './blocks/lcd';
import { neoPixelSetup } from './blocks/neopixel';
import { ledColorSetup } from './blocks/led-color';
import { setupReadPin } from './blocks/pin';
import { buttonSetup } from './blocks/button';
import { irRemoteSetup } from './blocks/ir_remote';
import { ultraSonicSensor } from './blocks/ultra_sonic_sensor';
import { tempSetupSensor } from './blocks/temp_setup';
import { VariableData } from '../../blockly/state/variable.data';
import {
  createListNumberState,
  createListStringState,
  createListBoolState,
  createListColorState
} from './blocks/list';
import { setVariable } from './blocks/set_variables';

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
  variables_set_number: setVariable,
  variables_set_string: setVariable,
  variables_set_boolean: setVariable,
  variables_set_colour: setVariable
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
