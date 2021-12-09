import Blockly from 'blockly';
import _ from 'lodash';

Blockly['Arduino']['fastled_setup'] = function (block) {
  const numberOfLeds = block.getFieldValue("NUMBER_LEDS");
  const pin = block.getFieldValue("PIN");
  const brightness = block.getFieldValue("BRIGHTNESS");
  Blockly["Arduino"].libraries_["define_fastled"] = '#include <FastLED.h>\n' + 
      '#define NUM_LEDS ' + numberOfLeds +'\n#define DATA_PIN ' + pin + 
      '\n#define COLOR_ORDER GRB\n\n' + 'CRGB leds[NUM_LEDS];\n' +
      'double brightness = ' + brightness + '.0 / 20;'

  Blockly["Arduino"].setupCode_["fastled"] = "\tFastLED.addLeds<WS2811, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS);\n";
  return '';
};

Blockly['Arduino']['fastled_set_color'] = function (block) {
  Blockly["Arduino"].functionNames_["set_color"] =
    "void setFastLEDColor(int pos, struct RGB color) {\n" +
    "\tpos = pos <= 0 ? 0 : pos;\n" +
    "\tpos = pos >= 1 ? pos - 1 : pos;\n" +
    "\tleds[pos].setRGB(color.green * brightness, color.red * brightness, color.blue * brightness);\n" +
    "\tFastLED.show();\n" +
    "}\n";

  const color = Blockly["Arduino"].valueToCode(
    block,
    "COLOR",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  const position = Blockly["Arduino"].valueToCode(
    block,
    "POSITION",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return '\tsetFastLEDColor(' + position + ',' + color + ');\n';
};
