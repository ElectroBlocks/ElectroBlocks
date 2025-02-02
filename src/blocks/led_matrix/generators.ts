import Blockly from 'blockly';
import { numberToCode } from '../../core/blockly/helpers/number-code.helper';
// TODO REPLACE WITH THIS -> https://github.com/valmat/LedMatrix
// TODO REPLACE WITH THIS LIBRARY IT's working now on the server.

Blockly["Arduino"]["led_matrix_setup"] = function (block) {
  const dataPin = block.getFieldValue("PIN_DATA");
  const clkPin = block.getFieldValue("PIN_CLK");
  const csPin = block.getFieldValue("PIN_CS");

  Blockly["Arduino"].libraries_[
    "define_led_matrix"
  ] = `// Includes the MAX7219 library for controlling LED matrices
#include <LedControl.h>;`;
  Blockly["Arduino"].libraries_[
    "led_matrix_setup"
  ] = `// Initializes the LED control object with specified pins 	
LedControl lc = LedControl(${dataPin},${clkPin},${csPin}, 1);`;
  Blockly["Arduino"].functionNames_[
    "led_matrix_set_row"
  ] = `void setRow(int row, byte leds) {
  // Because we are using the breadboard to rotate the matrix by 90 degrees
  lc.setColumn(0, 7 - row, leds); 
}`;

  Blockly["Arduino"].functionNames_[
    "led_matrix_set_led"
  ] = `void setLed(int row, int column, bool isOn) {
   // row and columns are reversed because of the breadboard to rotate 90 degrees
   lc.setLed(0,  (column - 1), 7 - (row - 1), isOn);
}`;
  Blockly["Arduino"].setupCode_["led_matrix"] = `   lc.shutdown(0, false);
   lc.setIntensity(0, 8);
   lc.clearDisplay(0);
`;

  return "";
};

Blockly["Arduino"]["led_matrix_make_draw"] = function (block) {
  let code = "// Updates the array of LED matrix rows with the new values\n";
  for (let row = 1; row <= 8; row += 1) {
    let binaryString = "0b";
    let realRow = row - 1;
    for (let col = 1; col <= 8; col += 1) {
      const lightState =
        block.getFieldValue(row + "," + col).toLowerCase() === "true"
          ? "1"
          : "0";
      binaryString += lightState;
    }
    code += `setRow(${realRow}, ${binaryString}); // Updating row ${row}\n`;
  }
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

  return `setLed(${row}, ${column}, ${state});\n`;
};