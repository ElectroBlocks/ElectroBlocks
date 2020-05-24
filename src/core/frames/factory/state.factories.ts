import { BlockData } from '../../blockly/state/block.data';
import { Timeline, ArduinoFrame } from '../arduino.frame';
import { rfidSetup } from './blocks/state/rfid';
import { bluetoothSetup, bluetoothMessage } from './blocks/state/bluetooth';
import { messageSetup, arduinoSendMessage } from './blocks/state/message';
import { timeSetup } from './blocks/state/time';
import {
  lcdScreenSetup,
  lcdSimplePrint,
  lcdScroll,
  lcdPrint,
  lcdBlink,
  lcdClear,
  lcdBacklight,
} from './blocks/state/lcd';
import { neoPixelSetup, setNeoPixelColor } from './blocks/state/neopixel';
import { ledColorSetup, setLedColor } from './blocks/state/led-color';
import { setupReadPin } from './blocks/state/pin';
import { buttonSetup } from './blocks/state/button';
import { irRemoteSetup } from './blocks/state/ir_remote';
import { debugBlock } from './blocks/state/debug';
import { ultraSonicSensor } from './blocks/state/ultra_sonic_sensor';
import { servoRotate } from './blocks/state/servo';
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
  setBooleanInList,
} from './blocks/state/list';
import { setVariable } from './blocks/state/set_variables';
import { ifElse } from './blocks/state/logic';
import { simpleLoop, forLoop } from './blocks/state/loop';
import { customBlock } from './blocks/state/function';
import { delayBlock } from './blocks/state/delay';
import { digitalWrite, analogWrite } from './blocks/state/led';
import { PinPicture } from '../arduino-components.state';
import { ledMatrixDraw, ledMatrixOnLed } from './blocks/state/led-matrix';
import { moveMotor } from './blocks/state/motor';
import { rfidScannedCard } from './blocks/value/rfid';

export interface StateGenerator {
  (
    blocks: BlockData[],
    block: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    previousState?: ArduinoFrame
  ): ArduinoFrame[];
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

  delay_block: delayBlock,

  arduino_send_message: arduinoSendMessage,

  bluetooth_send_message: bluetoothMessage,

  lcd_screen_simple_print: lcdSimplePrint,
  lcd_scroll: lcdScroll,
  lcd_screen_print: lcdPrint,
  lcd_blink: lcdBlink,
  lcd_screen_clear: lcdClear,
  lcd_backlight: lcdBacklight,

  led: digitalWrite(PinPicture.LED),
  digital_write: digitalWrite(PinPicture.LED_DIGITAL_WRITE),
  analog_write: analogWrite(PinPicture.LED_ANALOG_WRITE, 'WRITE_VALUE'),
  led_fade: analogWrite(PinPicture.LED, 'FADE'),
  set_color_led: setLedColor,
  neo_pixel_set_color: setNeoPixelColor,

  led_matrix_make_draw: ledMatrixDraw,
  led_matrix_turn_one_on_off: ledMatrixOnLed,

  rotate_servo: servoRotate,
  move_motor: moveMotor,
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
