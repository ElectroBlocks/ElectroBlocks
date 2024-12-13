import Blockly from 'blockly';
import type { Block } from 'blockly';
import _ from 'lodash';
import {
  hexToRgb,
  rgbToColorStruct,
  rgbToHex,
} from "../../core/blockly/helpers/color.helper";

Blockly["Arduino"]["rgb_led_setup"] = function (block: Block) {
  const redPin = block.getFieldValue("PIN_RED_1");
  const greenPin = block.getFieldValue("PIN_GREEN_1");
  const bluePin = block.getFieldValue("PIN_BLUE_1");

  const redPin2 = block.getFieldValue("PIN_RED_2");
  const greenPin2 = block.getFieldValue("PIN_GREEN_2");
  const bluePin2 = block.getFieldValue("PIN_BLUE_2");

  Blockly["Arduino"].libraries_["color_struct"] = `struct RGB {
    int red;
    int green;
    int blue;
};`;

  Blockly["Arduino"].setupCode_[
    "led_pin_" + redPin
  ] = `   pinMode(RED_PIN_1, OUTPUT); // Set the red LED pin as an output \n`;
  Blockly["Arduino"].setupCode_[
    "led_pin_" + greenPin
  ] = `   pinMode(GREEN_PIN_1, OUTPUT); // Set the green LED pin as an output \n`;
  Blockly["Arduino"].setupCode_[
    "led_pin_" + bluePin
  ] = `   pinMode(BLUE_PIN_1, OUTPUT); // Set the blue LED pin as an output\n`;

  Blockly["Arduino"].libraries_["color_pin_blue_1"] =
    "int BLUE_PIN_1 = " + bluePin + "; // Define pin number for the blue LED";

  Blockly["Arduino"].libraries_["color_pin_red_1"] =
    "int RED_PIN_1 = " + redPin + "; // Define pin number for the red LED";

  Blockly["Arduino"].libraries_["color_pin_green_1"] =
    "int GREEN_PIN_1 = " +
    greenPin +
    "; // Define pin number for the green LED";

  Blockly["Arduino"].functionNames_[
    "_setLedColor"
  ] = `// Set the brightness of each LED based on the RGB color values provided
void setLedColor(RGB color) {
    analogWrite(RED_PIN_1, color.red);  // Adjust the red LED brightness
    analogWrite(GREEN_PIN_1, color.green); // Adjust the green LED brightness
    analogWrite(BLUE_PIN_1, color.blue); // Adjust the blue LED brightness
}`;

  if (block.getFieldValue("NUMBER_OF_COMPONENTS") == "2") {
    Blockly["Arduino"].functionNames_[
      "_setLedColor"
    ] = `// Set the brightness of each LED based on the RGB color values provided
  void setLedColor(RGB color, int ledNumber) {
    if (ledNumber == 1) {
      analogWrite(RED_PIN_1, color.red);  // Adjust the red 1st LED brightness
      analogWrite(GREEN_PIN_1, color.green); // Adjust the lst green LED brightness
      analogWrite(BLUE_PIN_1, color.blue); // Adjust the 1st blue LED brightness
    } else {
      analogWrite(RED_PIN_2, color.red);  // Adjust the 2nd red LED brightness
      analogWrite(GREEN_PIN_2, color.green); // Adjust the 2nd green LED brightness
      analogWrite(BLUE_PIN_2, color.blue); // Adjust the 2nd blue LED brightness
    }
  }`;

    Blockly["Arduino"].setupCode_[
      "led_pin_" + redPin
    ] = `   pinMode(RED_PIN_1, OUTPUT); // Set the 1st red LED pin as an output \n`;
    Blockly["Arduino"].setupCode_[
      "led_pin_" + greenPin
    ] = `   pinMode(GREEN_PIN_1, OUTPUT); // Set the 1st green LED pin as an output \n`;
    Blockly["Arduino"].setupCode_[
      "led_pin_" + bluePin
    ] = `   pinMode(BLUE_PIN_1, OUTPUT); // Set the 1st blue LED pin as an output\n`;

    Blockly["Arduino"].setupCode_[
      "led_pin_" + redPin2
    ] = `   pinMode(RED_PIN_2, OUTPUT); // Set the 2nd red LED pin as an output \n`;
    Blockly["Arduino"].setupCode_[
      "led_pin_" + greenPin2
    ] = `   pinMode(GREEN_PIN_2, OUTPUT); // Set the 2nd green LED pin as an output \n`;
    Blockly["Arduino"].setupCode_[
      "led_pin_" + bluePin2
    ] = `   pinMode(BLUE_PIN_2, OUTPUT); // Set the 2nd LED blue pin as an output\n`;

    Blockly["Arduino"].libraries_["color_pin_blue_1"] =
      "int BLUE_PIN_1 = " +
      bluePin +
      "; // Define pin number for the blue lst LED";

    Blockly["Arduino"].libraries_["color_pin_red_1"] =
      "int RED_PIN_1 = " +
      redPin +
      "; // Define pin number for the red lst LED";

    Blockly["Arduino"].libraries_["color_pin_green_1"] =
      "int GREEN_PIN_1 = " +
      greenPin +
      "; // Define pin number for the green lst LED";

    Blockly["Arduino"].libraries_["color_pin_blue_2"] =
      "int BLUE_PIN_2 = " +
      bluePin2 +
      "; // Define pin number for the blue 2nd LED";

    Blockly["Arduino"].libraries_["color_pin_red_2"] =
      "int RED_PIN_2 = " +
      redPin2 +
      "; // Define pin number for the red 2nd LED";

    Blockly["Arduino"].libraries_["color_pin_green_2"] =
      "int GREEN_PIN_2 = " +
      greenPin2 +
      "; // Define pin number for the green 2nd LED";
  }

  return "";
};

Blockly["Arduino"]["set_color_led"] = function (block: Block) {
  let color =
    block.type == "set_color_led"
      ? Blockly["Arduino"].valueToCode(
          block,
          "COLOR",
          Blockly["Arduino"].ORDER_ATOMIC
        )
      : rgbToColorStruct(hexToRgb(block.getFieldValue("COLOR")));

  if (_.isEmpty(color)) {
    color = "{ 0, 0, 0 }";
  }

  if (Blockly["Arduino"].libraries_["color_pin_green_2"] !== undefined) {
    const ledNumber = +block.getFieldValue("WHICH_COMPONENT");
    return `setLedColor(${color}, ${ledNumber}); // Sets the ${
      ledNumber == 1 ? "1st" : "2nd"
    } RGB LED colour. \n`;
  }

  return `setLedColor(${color}); // Set the RGB LED colour. \n`;
};

Blockly["Arduino"]["set_simple_color_led"] =
  Blockly["Arduino"]["set_color_led"];