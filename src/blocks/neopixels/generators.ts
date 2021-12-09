import Blockly from "blockly";

Blockly["Arduino"]["neo_pixel_setup"] = function (block) {
  const numberOfLeds = block.getFieldValue("NUMBER_LEDS");
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].libraries_["define_neo_pixel"] =
    "#include <Adafruit_NeoPixel.h>;\n" +
    "#ifdef __AVR__ \n" +
    "" +
    "\t#include <avr/power.h>; \n" +
    "#endif\n";
  Blockly["Arduino"].libraries_["neo_pixel_setup"] =
    `double brightness = ${block.getFieldValue("BRIGHTNESS")}.0 / 20.0;\n\n` +
    "Adafruit_NeoPixel pixels = Adafruit_NeoPixel(" +
    numberOfLeds +
    ", " +
    pin +
    ", NEO_GRB + NEO_KHZ800);\n\n";

  Blockly["Arduino"].setupCode_["neo_pixel"] = "\tpixels.begin();\n";

  return "";
};

Blockly["Arduino"]["neo_pixel_set_color"] = function (block) {
  Blockly["Arduino"].functionNames_["set_color"] =
    "\n\nvoid setNeoPixelColor(double pos, RGB color) {\n" +
    "\tpos = pos <= 0 ? 0 : pos;\n" +
    "\tpos = pos >= 1 ? pos - 1 : pos;\n" +
    "\tpixels.setPixelColor((int)pos, color.red * brightness, color.green * brightness, color.blue * brightness);\n" +
    "\tpixels.show();\n" +
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

  return "\tsetNeoPixelColor(" + position + "," + color + ");\n";
};