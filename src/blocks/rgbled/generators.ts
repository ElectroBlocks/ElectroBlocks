import Blockly from 'blockly';
import type { Block } from 'blockly';
import _ from 'lodash';

Blockly['Arduino']['rgb_led_setup'] = function (block: Block) {
  const redPin = block.getFieldValue('PIN_RED');
  const greenPin = block.getFieldValue('PIN_GREEN');
  const bluePin = block.getFieldValue('PIN_BLUE');

  Blockly['Arduino'].setupCode_[
    'led_pin_' + redPin
  ] = `pinMode(RED_PIN, OUTPUT);\n`;
  Blockly['Arduino'].setupCode_[
    'led_pin_' + greenPin
  ] = `pinMode(GREEN_PIN, OUTPUT);\n`;
  Blockly['Arduino'].setupCode_[
    'led_pin_' + bluePin
  ] = `pinMode(BLUE_PIN, OUTPUT);\n`;

  Blockly['Arduino'].libraries_['color_pin_blue'] = 
  `int BLUE_PIN = ${bluePin};\n`;
  Blockly['Arduino'].libraries_['color_pin_red'] = 
  `int RED_PIN = ${redPin};\n`;
  Blockly['Arduino'].libraries_['color_pin_green'] = 
  `int GREEN_PIN = ${greenPin};\n`;

  Blockly['Arduino'].functionNames_['_setLedColor'] = `
    void setLedColor(RGB color) {
      analogWrite(GREEN_PIN, color.green);
      analogWrite(BLUE_PIN, color.blue);
      analogWrite(RED_PIN, color.red);
    }
  `;

  return '';
};

Blockly['Arduino']['set_color_led'] = function (block: Block) {
  let color = Blockly['Arduino'].valueToCode(
    block, 
    'COLOUR', 
    Blockly['Arduino'].ORDER_ATOMIC
  );

  if (_.isEmpty(color)) {
    color = '{ 0, 0, 0 }';
  }

  return `setLedColor(${color});\n`;
};
