import Blockly from 'blockly';
import type { Block } from 'blockly';
import _ from 'lodash';

Blockly["Arduino"]["rgb_led_setup"] = function (block: Block) {
  const redPin = block.getFieldValue("PIN_RED");
  const greenPin = block.getFieldValue("PIN_GREEN");
  const bluePin = block.getFieldValue("PIN_BLUE");

  Blockly["Arduino"].setupCode_[
    "led_pin_" + redPin
  ] = `   pinMode(RED_PIN, OUTPUT); // Set the red LED pin as an output \n`;
  Blockly["Arduino"].setupCode_[
    "led_pin_" + greenPin
  ] = `   pinMode(GREEN_PIN, OUTPUT); // Set the green LED pin as an output \n`;
  Blockly["Arduino"].setupCode_[
    "led_pin_" + bluePin
  ] = `   pinMode(BLUE_PIN, OUTPUT); // Set the blue LED pin as an output\n`;

  Blockly["Arduino"].libraries_["color_pin_blue"] =
    "int BLUE_PIN = " + bluePin + "; // Define pin number for the blue LED";

  Blockly["Arduino"].libraries_["color_pin_red"] =
    "int RED_PIN = " + redPin + "; // Define pin number for the red LED";

  Blockly["Arduino"].libraries_["color_pin_green"] =
    "int GREEN_PIN = " + greenPin + "; // Define pin number for the green LED";

  Blockly["Arduino"].functionNames_[
    "_setLedColor"
  ] = `// Set the brightness of each LED based on the RGB color values provided
void setLedColor(RGB color) {
  analogWrite(RED_PIN, color.red);  // Set the red LED pin as an output
  analogWrite(GREEN_PIN, color.green); // Set the green LED pin as an output
  analogWrite(BLUE_PIN, color.blue); // Set the blue LED pin as an output
}`;

  return "";
};

Blockly["Arduino"]["set_color_led"] = function (block: Block) {
  let color = Blockly["Arduino"].valueToCode(
    block,
    "COLOUR",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  if (_.isEmpty(color)) {
    color = "{ 0, 0, 0 }";
  }

  return "setLedColor(" + color + "); // Set the RGB LED colour. \n";
};
