import Blockly from 'blockly';
import getAvialablePinsFromSetupBlock from './helpers/getAvialablePinsFromSetupBlock';
import { COLOR_THEME } from '../constants';
import loopTimes from './helpers/looptimes';

const buttonSetupBlock: any = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('./blocks/button/button.png', 15, 15))
      .appendField('RFID Setup');
    this.appendDummyInput()
      .appendField('Connected to PIN# ')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return getAvialablePinsFromSetupBlock('button_setup');
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
  }
};

Blockly.Blocks['button_setup'] = buttonSetupBlock;

const isBtnPressedBlock: any = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('./blocks/button/button.png', 15, 15, '*')
      )
      .appendField('Is button')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return getAvialablePinsFromSetupBlock('button_setup');
        }),
        'PIN'
      )
      .appendField('pressed?');

    this.setOutput(true, 'Boolean');

    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['is_button_pressed'] = isBtnPressedBlock;
