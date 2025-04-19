import Blockly from "blockly";
import type { Block } from "blockly";
import _ from "lodash";
import { hexToRgb, rgbToColorStruct } from "../../core/blockly/helpers/color.helper";

// =============== ARDUINO GENERATOR =============== //

Blockly["Arduino"]["rgb_led_setup"] = function (block: Block) {
  const redPin1 = block.getFieldValue("PIN_RED_1");
  const greenPin1 = block.getFieldValue("PIN_GREEN_1");
  const bluePin1 = block.getFieldValue("PIN_BLUE_1");

  const redPin2 = block.getFieldValue("PIN_RED_2");
  const greenPin2 = block.getFieldValue("PIN_GREEN_2");
  const bluePin2 = block.getFieldValue("PIN_BLUE_2");

  const numComponents = block.getFieldValue("NUMBER_OF_COMPONENTS");

  Blockly["Arduino"].libraries_["color_struct"] = `
struct RGB {
  int red;
  int green;
  int blue;
};`;

  Blockly["Arduino"].variables_["RED_PIN_1"] = `int RED_PIN_1 = ${redPin1};`;
  Blockly["Arduino"].variables_["GREEN_PIN_1"] = `int GREEN_PIN_1 = ${greenPin1};`;
  Blockly["Arduino"].variables_["BLUE_PIN_1"] = `int BLUE_PIN_1 = ${bluePin1};`;

  Blockly["Arduino"].setupCode_["setup_led1"] = `
  pinMode(RED_PIN_1, OUTPUT);
  pinMode(GREEN_PIN_1, OUTPUT);
  pinMode(BLUE_PIN_1, OUTPUT);`;

  if (numComponents === "2") {
    Blockly["Arduino"].variables_["RED_PIN_2"] = `int RED_PIN_2 = ${redPin2};`;
    Blockly["Arduino"].variables_["GREEN_PIN_2"] = `int GREEN_PIN_2 = ${greenPin2};`;
    Blockly["Arduino"].variables_["BLUE_PIN_2"] = `int BLUE_PIN_2 = ${bluePin2};`;

    Blockly["Arduino"].setupCode_["setup_led2"] = `
  pinMode(RED_PIN_2, OUTPUT);
  pinMode(GREEN_PIN_2, OUTPUT);
  pinMode(BLUE_PIN_2, OUTPUT);`;

    Blockly["Arduino"].functions_["set_led_color"] = `
void setLedColor(RGB color, int ledNumber) {
  if (ledNumber == 1) {
    analogWrite(RED_PIN_1, color.red);
    analogWrite(GREEN_PIN_1, color.green);
    analogWrite(BLUE_PIN_1, color.blue);
  } else {
    analogWrite(RED_PIN_2, color.red);
    analogWrite(GREEN_PIN_2, color.green);
    analogWrite(BLUE_PIN_2, color.blue);
  }
}`;
  } else {
    Blockly["Arduino"].functions_["set_led_color"] = `
void setLedColor(RGB color) {
  analogWrite(RED_PIN_1, color.red);
  analogWrite(GREEN_PIN_1, color.green);
  analogWrite(BLUE_PIN_1, color.blue);
}`;
  }

  return "";
};

Blockly["Arduino"]["set_color_led"] = function (block: Block) {
  let color = rgbToColorStruct(hexToRgb(block.getFieldValue("COLOR")));
  if (_.isEmpty(color)) {
    color = "{ 0, 0, 0 }";
  }

  if (Blockly["Arduino"].variables_["RED_PIN_2"] !== undefined) {
    const ledNumber = +block.getFieldValue("WHICH_COMPONENT");
    return `setLedColor(${color}, ${ledNumber}); // Sets color of RGB LED ${ledNumber}\n`;
  }

  return `setLedColor(${color}); // Sets RGB LED color\n`;
};

Blockly["Arduino"]["set_simple_color_led"] = Blockly["Arduino"]["set_color_led"];

// =============== PYTHON GENERATOR =============== //

Blockly["Python"]["rgb_led_setup"] = function (block: Block) {
  const redPin1 = block.getFieldValue("PIN_RED_1");
  const greenPin1 = block.getFieldValue("PIN_GREEN_1");
  const bluePin1 = block.getFieldValue("PIN_BLUE_1");

  const redPin2 = block.getFieldValue("PIN_RED_2");
  const greenPin2 = block.getFieldValue("PIN_GREEN_2");
  const bluePin2 = block.getFieldValue("PIN_BLUE_2");

  const numComponents = block.getFieldValue("NUMBER_OF_COMPONENTS");

  Blockly["Python"].definitions_["import_pyfirmata"] = "from pyfirmata import Arduino, util";

  Blockly["Python"].variables_["red1"] = `red1 = board.digital[${redPin1}]`;
  Blockly["Python"].variables_["green1"] = `green1 = board.digital[${greenPin1}]`;
  Blockly["Python"].variables_["blue1"] = `blue1 = board.digital[${bluePin1}]`;

  Blockly["Python"].setupCode_["setup_led1"] = `
red1.mode = 1
green1.mode = 1
blue1.mode = 1`;

  if (numComponents === "2") {
    Blockly["Python"].variables_["red2"] = `red2 = board.digital[${redPin2}]`;
    Blockly["Python"].variables_["green2"] = `green2 = board.digital[${greenPin2}]`;
    Blockly["Python"].variables_["blue2"] = `blue2 = board.digital[${bluePin2}]`;

    Blockly["Python"].setupCode_["setup_led2"] = `
red2.mode = 1
green2.mode = 1
blue2.mode = 1`;

    Blockly["Python"].functions_["set_led_color"] = `
def set_led_color(color, led_number):
    r, g, b = color
    r = 1 if r > 127 else 0
    g = 1 if g > 127 else 0
    b = 1 if b > 127 else 0
    if led_number == 1:
        red1.write(r)
        green1.write(g)
        blue1.write(b)
    else:
        red2.write(r)
        green2.write(g)
        blue2.write(b)
`;
  } else {
    Blockly["Python"].functions_["set_led_color"] = `
def set_led_color(color):
    r, g, b = color
    r = 1 if r > 127 else 0
    g = 1 if g > 127 else 0
    b = 1 if b > 127 else 0
    red1.write(r)
    green1.write(g)
    blue1.write(b)
`;
  }

  return "";
};

Blockly["Python"]["set_color_led"] = function (block: Block) {
  const hex = block.getFieldValue("COLOR") || "#000000";
  const { r, g, b } = hexToRgb(hex);
  const colorTuple = `(${r}, ${g}, ${b})`;

  if (Blockly["Python"].variables_["red2"] !== undefined) {
    const ledNumber = +block.getFieldValue("WHICH_COMPONENT");
    return `set_led_color(${colorTuple}, ${ledNumber})  # Set LED ${ledNumber} color\n`;
  }

  return `set_led_color(${colorTuple})  # Set RGB LED color\n`;
};

Blockly["Python"]["set_simple_color_led"] = Blockly["Python"]["set_color_led"];
