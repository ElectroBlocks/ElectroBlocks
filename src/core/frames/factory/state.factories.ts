import { BlockData } from '../../blockly/state/block.data';
import { Timeline, ArduinoFrame } from '../arduino.frame';
import { rfidSetup } from './state/rfid';
import { bluetoothSetup, bluetoothMessage } from './state/bluetooth';
import { messageSetup, arduinoSendMessage } from './state/message';
import { timeSetup } from './state/time';
import {
  lcdScreenSetup,
  lcdSimplePrint,
  lcdScroll,
  lcdPrint,
  lcdBlink,
  lcdClear,
  lcdBacklight,
} from './state/lcd';
import { neoPixelSetup, setNeoPixelColor } from './state/neopixel';
import { ledColorSetup, setLedColor } from './state/led-color';
import { setupReadPin } from './state/pin';
import { buttonSetup } from './state/button';
import { irRemoteSetup } from './state/ir_remote';
import { debugBlock } from './state/debug';
import { ultraSonicSensor } from './state/ultra_sonic_sensor';
import { servoRotate } from './state/servo';
import { tempSetupSensor } from './state/temp_setup';
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
} from './state/list';
import { setVariable } from './state/set_variables';
import { ifElse } from './state/logic';
import { simpleLoop, forLoop } from './state/loop';
import { customBlock } from './state/function';
import { delayBlock } from './state/delay';
import { digitalWrite, analogWrite } from './state/led';
import { PinPicture } from '../arduino-components.state';
import { ledMatrixDraw, ledMatrixOnLed } from './state/led-matrix';
import { moveMotor } from './state/motor';
import { rfidScannedCard } from './value/rfid';

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
