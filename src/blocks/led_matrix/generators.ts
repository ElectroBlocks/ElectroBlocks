import Blockly from "blockly";
// TODO REPLACE WITH THIS -> https://github.com/valmat/LedMatrix

Blockly["Python"]["led_matrix_setup"] = function (block) {
  const dataPin = block.getFieldValue("PIN_DATA");
  const clkPin = block.getFieldValue("PIN_CLK");
  const csPin = block.getFieldValue("PIN_CS");
  const isBreadboard = block.getFieldValue("BREADBOARD") === "TRUE";

  return `eb.config_led_matrix(${dataPin},${csPin},${clkPin}, ${
    isBreadboard ? "True" : "False"
  })`;
};
Blockly["Arduino"]["led_matrix_setup"] = function (block) {
  const dataPin = block.getFieldValue("PIN_DATA");
  const clkPin = block.getFieldValue("PIN_CLK");
  const csPin = block.getFieldValue("PIN_CS");
  const usingBreadboard = block.getFieldValue("BREADBOARD") === "TRUE";

  Blockly["Arduino"].libraries_[
    "define_led_matrix"
  ] = `// This a wrapper library on LedControl that allows us to rotate for breadboards
#include "LedMatrix.h";`;
  Blockly["Arduino"].libraries_["ledObject"] = `
LedMatrix lm(${dataPin}, ${clkPin}, ${csPin}, LedMatrix::R0, ${usingBreadboard});
byte developer_ledmatrix_image[8] = {
    B00000000,
    B00000000,
    B00000000,
    B00000000,
    B00000000,
    B00000000,
    B00000000,
    B00000000
};`;

  return "";
};

Blockly["Python"]["led_matrix_make_draw"] = function (block) {
  let code = "\neb.draw_led_matrix([\n";
  for (let i = 1; i <= 8; i += 1) {
    code += '\t"b';
    for (let j = 1; j <= 8; j += 1) {
      const lightState =
        block.getFieldValue(i + "," + j).toLowerCase() === "true";
      code += lightState ? "1" : "0";
    }
    code += '",\n';
  }
  code += "])\n\n";
  return code;
};
Blockly["Arduino"]["led_matrix_make_draw"] = function (block) {
  let code = "\n";
  for (let i = 1; i <= 8; i += 1) {
    code += `developer_ledmatrix_image[${i - 1}] = B`;
    for (let j = 1; j <= 8; j += 1) {
      const lightState =
        block.getFieldValue(i + "," + j).toLowerCase() === "true";
      code += lightState ? "1" : "0";
    }
    code += `;\n`;
  }

  code += "lm.setImage(developer_ledmatrix_image); // Turns on the leds\n\n";
  return code;
};

Blockly["Python"]["led_matrix_turn_one_on_off"] = function (block) {
  const row = Blockly["Arduino"].valueToCode(
    block,
    "ROW",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  let column = Blockly["Arduino"].valueToCode(
    block,
    "COLUMN",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  const state = block.getFieldValue("STATE") === "ON";

  return `eb.set_led_matrix_led(${row}, ${column}, ${
    state ? "True" : "False"
  }) \n`;
};

Blockly["Arduino"]["led_matrix_turn_one_on_off"] = function (block) {
  // todo fix code with variables
  const row = Blockly["Arduino"].valueToCode(
    block,
    "ROW",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  let column = Blockly["Arduino"].valueToCode(
    block,
    "COLUMN",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  const state = block.getFieldValue("STATE") === "ON" ? "true" : "false";

  return `\nlm.setPixel(${column}, ${row}, ${state}); // change one pixel in the buffer. 
lm.setImage(); // changes the pixels on the device\n
`;
};
