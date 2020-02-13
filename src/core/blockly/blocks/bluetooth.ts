import Blockly from 'blockly';
import { COLOR_THEME } from '../../../constants/colors';

import selectedBoard from '../../../constants/arduino';
import loopTimes from './helpers/looptimes';

Blockly.defineBlocksWithJsonArray([
  {
    type: 'bluetooth_get_message',
    message0: '%1 bluetooth get message.',
    args0: [
      {
        type: 'field_image',
        src: './blocks/bluetooth/bluetooth.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      }
    ],
    output: 'String',
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'bluetooth_has_message',
    message0: '%1 Is bluetooth receiving message?',
    args0: [
      {
        type: 'field_image',
        src: './blocks/bluetooth/bluetooth.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      }
    ],
    output: 'Boolean',
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'bluetooth_send_message',
    message0: '%1 bluetooth send message. %2',
    args0: [
      {
        type: 'field_image',
        src: './blocks/bluetooth/bluetooth.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'input_value',
        name: 'MESSAGE',
        check: 'String'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  }
]);

const bluetoothSetupBlock: any = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('/blocks/bluetooth/bluetooth.png', 15, 15)
      )
      .appendField('Bluetooth Setup');
    this.appendDummyInput()
      .appendField('RX Pin# ')
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
      .appendField('Loop')
      .appendField(new Blockly.FieldDropdown(() => loopTimes()), 'LOOP');
    this.appendDummyInput()
      .appendField('Receiving Message? ')
      .appendField(
        new Blockly.FieldCheckbox('TRUE', (value) => {
          if ('FALSE' === value) {
            this.getField('message').setValue('');
          }
          return value;
        }),
        'receiving_message'
      );
    this.appendDummyInput()
      .appendField('Message:')
      .appendField(
        new Blockly.FieldTextInput('message', (value) => {
          if (this.getFieldValue('receiving_message') === 'FALSE') {
            return null;
          }
          return value;
        }),
        'message'
      );
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  getSensorData() {
    return {
      receiving_message: this.getFieldValue('receiving_message') === 'TRUE',
      message: this.getFieldValue('message'),
      loop: this.getFieldValue('LOOP')
    };
  }
};

Blockly.Blocks['bluetooth_setup'] = bluetoothSetupBlock;
