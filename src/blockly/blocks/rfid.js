import Blockly from 'blockly';
import { COLOR_THEME } from '../constants';

import selectedBoard from '../../constants/arduino';
import loopTimes from './helpers/looptimes';

Blockly.defineBlocksWithJsonArray([
  {
    type: 'rfid_scan',
    message0: '%1 Did RFID read scan a new card?',
    args0: [
      {
        type: 'field_image',
        src: './blocks/rfid/rfid.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      }
    ],
    inputsInline: false,
    output: 'Boolean',
    colour: COLOR_THEME.SENSOR,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'rfid_card',
    lastDummyAlign0: 'RIGHT',
    metadata: 'blue',
    message0: '%1 Get RFID Card Number.',
    args0: [
      {
        type: 'field_image',
        src: './blocks/rfid/rfid.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      }
    ],
    inputsInline: false,
    output: 'String',
    colour: COLOR_THEME.SENSOR,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'rfid_tag',
    lastDummyAlign0: 'RIGHT',
    metadata: 'blue',
    message0: '%1 Get RFID Tag',
    args0: [
      {
        type: 'field_image',
        src: './blocks/rfid/rfid.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      }
    ],
    inputsInline: false,
    output: 'String',
    colour: COLOR_THEME.SENSOR,
    tooltip: '',
    helpUrl: ''
  }
]);

const rfidSetupBlock = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('./blocks/rfid/rfid.png', 15, 15)
      )
      .appendField('RFID Setup');
    this.appendDummyInput()
      .appendField('RX Pin#')
      .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), 'RX')
      .appendField('TX Pin#')
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        'TX'
      );
    this.appendDummyInput('SHOW_CODE_VIEW').appendField(
      '-----------------------------------------'
    );
    this.appendDummyInput()
      .appendField('LOOP')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        'LOOP'
      );
    this.appendDummyInput()
      .appendField('Scanned Card?')
      .appendField(
        new Blockly.FieldCheckbox('TRUE', (value) => {
          if ('FALSE' === value) {
            this.getField('card_number').setValue('');
            this.getField('tag').setValue('');
          }
          return value;
        }),
        'scanned_card'
      );
    this.appendDummyInput()
      .appendField('Card #:')
      .appendField(
        new Blockly.FieldTextInput('card_number', (value) => {
          if (this.getFieldValue('scanned_card') === 'FALSE') {
            return null;
          }
          return value;
        }),
        'card_number'
      );
    this.appendDummyInput()
      .appendField('Tag#:')
      .appendField(
        new Blockly.FieldTextInput('tag', (value) => {
          if (this.getFieldValue('scanned_card') === 'FALSE') {
            return null;
          }
          return value;
        }),
        'tag'
      );
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['rfid_setup'] = rfidSetupBlock;
