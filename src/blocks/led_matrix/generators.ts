import Blockly from 'blockly';
import { numberToCode } from '../../core/blockly/helpers/number-code.helper';
// TODO REPLACE WITH THIS -> https://github.com/valmat/LedMatrix

Blockly['Arduino']['led_matrix_setup'] = function (block) {
  const dataPin = block.getFieldValue('PIN_DATA');
  const clkPin = block.getFieldValue('PIN_CLK');
  const csPin = block.getFieldValue('PIN_CS');

  Blockly["Arduino"].libraries_[
    "define_led_matrix"
  ] = `// Includes the LedControlMS library for controlling LED matrices
#include <LedControlMS.h>;`;
  Blockly["Arduino"].libraries_[
    "led_matrix_setup"
  ] = `// Initializes the LED control object with specified pins 	
LedControl lc = LedControl(${dataPin},${clkPin},${csPin},1);`;

  Blockly["Arduino"].setupCode_[
    "led_matrix"
  ] = `   lc.shutdown(0,false); // Wakes up the first display (device 0)
   lc.setIntensity(0,8); // Sets the brightness of the first display to a medium level
   lc.clearDisplay(0); // Clears the display for the first device
`;

  return '';
};

Blockly['Arduino']['led_matrix_make_draw'] = function (block) {
  let code = '\n\t//START CODE TO DRAW BLOCK ' + block.id + '\n';

  for (let i = 1; i <= 8; i += 1) {
    for (let j = 1; j <= 8; j += 1) {
      const lightState = block.getFieldValue(i + ',' + j).toLowerCase();
      // when you hook it up you have to reverse the x and y and minus to because it starts at zero.
      code +=
        '\tlc.setLed(0, ' +
        (j - 1) +
        ', ' +
        (7 - (i - 1)) +
        ', ' +
        lightState +
        ');\n';
    }
  }

  code += '\n\t//FINISH CODE TO DRAW BLOCK ' + block.id + '\n';

  return code;
};

Blockly['Arduino']['led_matrix_turn_one_on_off'] = function (block) {
  // todo fix code with variables
  const row = Blockly['Arduino'].valueToCode(
    block,
    'ROW',
    Blockly['Arduino'].ORDER_ATOMIC
  );
  let column = Blockly['Arduino'].valueToCode(
    block,
    'COLUMN',
    Blockly['Arduino'].ORDER_ATOMIC
  );

  const state = block.getFieldValue('STATE') === 'ON' ? 'true' : 'false';

  return (
    '\tlc.setLed(0, ' +
    // This has to be 7 even though it's an 8 by 8 matrix
    // Because we are already substracting one
    // part still needs work
    numberToCode(column) +
    ',' +
    '(7 - ' +
    numberToCode(row) +
    ' ), ' +
    state +
    ');\n'
  );
};
