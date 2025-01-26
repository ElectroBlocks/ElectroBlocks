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
#include <MAX7219.h>;`;
  Blockly["Arduino"].libraries_[
    "led_matrix_setup"
  ] = `// Initializes the LED control object with specified pins 	
MAX7219 Matrix(1, ${dataPin},${clkPin},${csPin});`;
  Blockly["Arduino"].functionNames_[
    "led_matrix_set_row"
  ] = `void setRow(int row, byte leds) {
  // Because we are using the breadboard
  // the row is the column and we have to inverse row.
  Matrix.setColumn(1, 7 - row, leds);
}`;
  Blockly["Arduino"].setupCode_[
    "led_matrix"
  ] = `   Matrix.setIntensity(1,8); // Sets the brightness of the first display to a medium level
   Matrix.clearDisplay(1); // Clears the display for the first device
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

  return (
    "   Matrix.setLed(1, 7 - " +
    // This has to be 7 even though it's an 8 by 8 matrix
    // Because we are already substracting one
    // part still needs work
    numberToCode(row) +
    "," +
    numberToCode(column) +
    "," +
    state +
    ");\n"
  );
};