import Blockly from 'blockly';
import {
  getAvailablePins,
  configuredPins,
} from './helpers/getAvialablePinsFromSetupBlock';
import { COLOR_THEME } from '../constants/colors';
import loopTimes from './helpers/looptimes';
import selectedBoard from '../selectBoard';
const buttonSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('./blocks/button/button.png', 15, 15))
      .appendField('Button Setup');
    this.appendDummyInput()
      .appendField('Connected to PIN# ')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return getAvailablePins(
            'button_setup',
            this.getFieldValue('PIN'),
            selectedBoard().digitalPins
          );
        }),
        'PIN'
      );
    this.appendDummyInput().appendField(
      '-------------------------------------'
    );
    this.appendDummyInput()
      .appendField('Loop ')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        'LOOP'
      );
    this.appendDummyInput()
      .appendField('Is button pressed: ')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'is_pressed');
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['button_setup'] = buttonSetupBlock;

const isBtnPressedBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('./blocks/button/button.png', 15, 15, '*')
      )
      .appendField('Is button')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return configuredPins('button_setup', selectedBoard().digitalPins);
        }),
        'PIN'
      )
      .appendField('pressed?');

    this.setOutput(true, 'Boolean');

    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['is_button_pressed'] = isBtnPressedBlock;
