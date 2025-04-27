import Blockly from "blockly";
import type { Block } from "blockly";
import _ from "lodash";
import { hexToRgb, rgbToColorStruct } from "../../core/blockly/helpers/color.helper";

if (!Blockly.Arduino) {
  Blockly.Arduino = {};
}
Blockly.Arduino.libraries_ = Blockly.Arduino.libraries_ || {};
Blockly.Arduino.variables_ = Blockly.Arduino.variables_ || {};
Blockly.Arduino.setupCode_ = Blockly.Arduino.setupCode_ || {};
Blockly.Arduino.functions_ = Blockly.Arduino.functions_ || {};
Blockly.Arduino.functionNames_ = Blockly.Arduino.functionNames_ || {};

if (!Blockly.Python) {
  Blockly.Python = {};
}
Blockly.Python.imports_ = Blockly.Python.imports_ || {};
Blockly.Python.variables_ = Blockly.Python.variables_ || {};
Blockly.Python.setupCode_ = Blockly.Python.setupCode_ || {};
Blockly.Python.functions_ = Blockly.Python.functions_ || {};

// =============== ARDUINO GENERATOR ===============

Blockly["Arduino"]["rgb_led_setup"] = function (block: Block) {
  const redPin1 = block.getFieldValue("PIN_RED_1");
  const greenPin1 = block.getFieldValue("PIN_GREEN_1");
  const bluePin1 = block.getFieldValue("PIN_BLUE_1");

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
    const redPin2 = block.getFieldValue("PIN_RED_2");
    const greenPin2 = block.getFieldValue("PIN_GREEN_2");
    const bluePin2 = block.getFieldValue("PIN_BLUE_2");

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
  let hexColor = block.getFieldValue("COLOR");
  let color = rgbToColorStruct(hexToRgb(hexColor));

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

// =============== PYTHON GENERATOR ===============

Blockly["Python"]["rgb_led_setup"] = function (block: Block) {
  const redPin1 = block.getFieldValue("PIN_RED_1");
  const greenPin1 = block.getFieldValue("PIN_GREEN_1");
  const bluePin1 = block.getFieldValue("PIN_BLUE_1");

  Blockly["Python"].imports_["machine"] = "import machine";

  return `
# Initialize pins
red_pin = machine.PWM(machine.Pin(${redPin1}))
green_pin = machine.PWM(machine.Pin(${greenPin1}))
blue_pin = machine.PWM(machine.Pin(${bluePin1}))

# Initialize the program settings
red_pin.freq(1000)
green_pin.freq(1000)
blue_pin.freq(1000)
`;
};

Blockly["Python"]["set_color_led"] = function (block: Block) {
  let hexColor = block.getFieldValue("COLOR");
  let colorStruct = hexToRgb(hexColor);

  let r = 0, g = 0, b = 0;
  if (colorStruct) {
    r = colorStruct.r ?? 0;
    g = colorStruct.g ?? 0;
    b = colorStruct.b ?? 0;
  }

  // Invert PWM for LEDs (assuming active-low wiring)
  const rDuty = Math.round((1 - (r / 255)) * 1023);
  const gDuty = Math.round((1 - (g / 255)) * 1023);
  const bDuty = Math.round((1 - (b / 255)) * 1023);

  return `
red_pin.duty(${rDuty})
green_pin.duty(${gDuty})
blue_pin.duty(${bDuty})
`;
};

Blockly["Python"]["set_simple_color_led"] = Blockly["Python"]["set_color_led"];

// =============== FOREVER LOOP HANDLER ===============

Blockly["Python"]["controls_forever"] = function (block: Block) {
  const statements = Blockly.Python.statementToCode(block, 'DO');
  return `
while True:
${statements}
`;
};