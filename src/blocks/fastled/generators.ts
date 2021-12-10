import Blockly from 'blockly';
import _ from 'lodash';

Blockly['Arduino']['fastled_setup'] = function (block) {
  const numberOfLeds = block.getFieldValue('NUMBER_LEDS');
  const pin = block.getFieldValue('PIN');
  const brightness = block.getFieldValue('BRIGHTNESS');
  const colorOrder = block.getFieldValue('COLOR_ORDER');
  const chipSet = block.getFieldValue('CHIP_SET');
  Blockly['Arduino'].libraries_['define_fastled'] = `
#include <FastLED.h>
#define NUM_LEDS ${numberOfLeds}
#define DATA_PIN ${pin} 
CRGB leds[NUM_LEDS];

`;

  Blockly['Arduino'].setupCode_['fastled'] = `
    FastLED.addLeds<${chipSet}, DATA_PIN, ${colorOrder}>(leds, NUM_LEDS);
    FastLED.setBrightness(${brightness});    
`;
  return '';
};

Blockly['Arduino']['fastled_set_color'] = function (block) {
  Blockly['Arduino'].functionNames_['set_color'] = `
void setFastLEDColor(int pos, struct RGB color) {
    pos = pos <= 0 ? 0 : pos;
    pos = pos >= 1 ? pos - 1 : pos;
    leds[pos].setRGB(color.red, color.green, color.blue);
    FastLED.show();
}
`;

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
