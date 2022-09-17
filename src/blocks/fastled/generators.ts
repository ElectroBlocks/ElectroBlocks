import Blockly from 'blockly';
import _ from 'lodash';
import { hexToRgb } from '../../core/blockly/helpers/color.helper';

Blockly['Arduino']['fastled_setup'] = function (block) {
  const numberOfLeds = block.getFieldValue('NUMBER_LEDS');
  const pin = block.getFieldValue('PIN');
  const brightness = block.getFieldValue('BRIGHTNESS');
  const colorOrder = block.getFieldValue('COLOR_ORDER');
  const chipSet = block.getFieldValue('CHIP_SET');
  Blockly['Arduino']['fastled_info'] = { numberOfLeds };
  // This done to know when to cut off the loop
  Blockly['Arduino'].libraries_['define_fastled'] = `
#include <FastLED.h>
#define NUM_LEDS ${numberOfLeds}
#define DATA_PIN ${pin} 
CRGB leds[NUM_LEDS];

`;
  Blockly['Arduino'].functionNames_['fastled_setColorFunction'] = `
void setFastLEDColor(int pos, struct RGB color) {
    pos = pos <= 0 ? 0 : pos;
    pos = pos >= 1 ? pos - 1 : pos;
    leds[pos].setRGB(color.red, color.green, color.blue);
}
`;

  Blockly['Arduino'].setupCode_['fastled'] = `
    FastLED.addLeds<${chipSet}, DATA_PIN, ${colorOrder}>(leds, NUM_LEDS);
    FastLED.setBrightness(${brightness});    
`;
  return '';
};

const getRowColId = (position: number): string => {
  const row = Math.ceil(position / 12);

  return `${row}-${position - (row - 1) * 12}`;
};

Blockly['Arduino']['fastled_set_all_colors'] = function (block) {
  const maxLeds = Blockly['Arduino']['fastled_info'].numberOfLeds;
  const statements = [`// Colors for block ${block.id} \n`];
  for (let position = 1; position <= maxLeds; position += 1) {
    const hexColor = block.getFieldValue(getRowColId(position));
    const rgbColor = hexToRgb(hexColor);
    statements.push(
      '\tsetFastLEDColor(' +
        position +
        ',' +
        `{${rgbColor.red}, ${rgbColor.green}, ${rgbColor.blue}}` +
        ');\n'
    );
  }

  return statements.join('');
};

Blockly['Arduino']['fastled_show_all_colors'] = function (block) {
  return `FastLED.show();\n`;
};

Blockly['Arduino']['fastled_set_color'] = function (block) {
  const color = Blockly['Arduino'].valueToCode(
    block,
    'COLOR',
    Blockly['Arduino'].ORDER_ATOMIC
  );

  const position = Blockly['Arduino'].valueToCode(
    block,
    'POSITION',
    Blockly['Arduino'].ORDER_ATOMIC
  );

  return '\tsetFastLEDColor(' + position + ',' + color + ');\n';
};
