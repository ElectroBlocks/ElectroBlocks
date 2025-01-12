import Blockly from 'blockly';
import { numberToCode } from '../../core/blockly/helpers/number-code.helper';
// TODO REPLACE WITH THIS -> https://github.com/valmat/LedMatrix

Blockly["Arduino"]["led_matrix_setup"] = function (block) {
  const dataPin = block.getFieldValue("PIN_DATA");
  const clkPin = block.getFieldValue("PIN_CLK");
  const csPin = block.getFieldValue("PIN_CS");

  Blockly["Arduino"].libraries_[
    "define_led_matrix"
  ] = `// Includes the LedControlMS library for controlling LED matrices
#include <LedControlMS.h>;`;
  Blockly["Arduino"].libraries_[
    "led_matrix_setup"
  ] = `// Initializes the LED control object with specified pins 	
LedControl lc = LedControl(${dataPin},${clkPin},${csPin},1);
uint8_t ledMatrixRows[8];
`;
  Blockly["Arduino"].functionNames_["set_all_leds"] = `void setAllLeds() {
   for (int i = 0; i < 8; i++) {
      lc.setRow(0, i, ledMatrixRows[i]);
   }
}`;
  Blockly["Arduino"].setupCode_[
    "led_matrix"
  ] = `   lc.shutdown(0,false); // Wakes up the first display (device 0)
   lc.setIntensity(0,8); // Sets the brightness of the first display to a medium level
   lc.clearDisplay(0); // Clears the display for the first device
`;

  return "";
};

Blockly["Arduino"]["led_matrix_make_draw"] = function (block) {
  let code = "// Updates the array of LED matrix rows with the new values\n";
  for (let row = 1; row <= 8; row += 1) {
    let binaryString = "";
    let realRow = 7 - (row - 1);
    for (let col = 1; col <= 8; col += 1) {
      const lightState =
        block.getFieldValue(col + "," + row).toLowerCase() === "true"
          ? "1"
          : "0";
      binaryString += lightState;
    }
    code += `ledMatrixRows[${realRow}] = ${toHexByte(
      binaryString
    )}; // Updating row ${realRow + 1}\n`;
  }
  code += `setAllLeds();\n`;
  return code;
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

  return (
    "\tlc.setLed(0, " +
    // This has to be 7 even though it's an 8 by 8 matrix
    // Because we are already substracting one
    // part still needs work
    numberToCode(column) +
    "," +
    "(7 - " +
    numberToCode(row) +
    " ), " +
    state +
    ");\n"
  );
};

function toHexByte(binaryString) {
  // Ensure the binary string is 8 bits
  if (binaryString.length !== 8 || /[^01]/.test(binaryString)) {
    throw new Error(
      "Input must be an 8-bit binary string containing only 0s and 1s"
    );
  }

  // Convert the binary string to a number
  const number = parseInt(binaryString, 2);

  // Convert the number to a hexadecimal string and pad to ensure 2 characters
  const hexString = number.toString(16).padStart(2, "0");

  // Add the "0x" prefix
  return `0x${hexString.toUpperCase()}`;
}