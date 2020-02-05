import Blockly from 'blockly';
import { COLOR_THEME } from '../constants';

Blockly.defineBlocksWithJsonArray([
  {
    type: 'arduino_loop',
    message0: 'Loop (runs forever) %1 Loop (runs %2 times) %3 %4',
    args0: [
      {
        type: 'input_dummy'
      },
      {
        type: 'field_number',
        name: 'LOOP_TIMES',
        value: 3,
        min: 0,
        max: 1000
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'input_statement',
        name: 'loop'
      }
    ],
    colour: COLOR_THEME.ARDUINO_START_BLOCK,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'arduino_setup',
    message0: 'Setup (runs once) %1 %2',
    args0: [
      {
        type: 'input_dummy'
      },
      {
        type: 'input_statement',
        name: 'setup'
      }
    ],
    colour: COLOR_THEME.ARDUINO_START_BLOCK,
    tooltip: '',
    helpUrl: ''
  }
]);
