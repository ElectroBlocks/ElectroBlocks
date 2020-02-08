import selectedBoard from '../../constants/arduino';
import Blockly from 'blockly';

import getAvialablePinsFromSetupBlock from './helpers/getAvialablePinsFromSetupBlock';
import { COLOR_THEME } from '../constants';
import loopTimes from './helpers/looptimes';

Blockly.defineBlocksWithJsonArray([
  {
    type: 'digital_write',
    message0: '%1 Turn  %2 pin# %3',
    args0: [
      {
        type: 'field_image',
        src: './blocks/arduino/digital_write.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'field_dropdown',
        name: 'STATE',
        options: [
          ['on', 'ON'],
          ['off', 'OFF']
        ]
      },
      {
        type: 'field_dropdown',
        name: 'PIN',
        options: selectedBoard().digitalPins
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'analog_read',
    message0: '%1 Read number from analog pin# %2',
    args0: [
      {
        type: 'field_image',
        src: './blocks/arduino/analog_read.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'field_dropdown',
        name: 'PIN',
        options: selectedBoard().analogPins
      }
    ],
    output: 'Number',
    colour: COLOR_THEME.SENSOR,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'analog_write',
    message0: '%1 Send analog wave to pin %2 %3 Wave Intensity %4',
    args0: [
      {
        type: 'field_image',
        src: './blocks/arduino/analog_write.png',
        width: 15,
        height: 20,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'field_dropdown',
        name: 'PIN',
        options: selectedBoard().pwmPins
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'input_value',
        name: 'WRITE_VALUE',
        check: 'Number',
        align: 'RIGHT'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  }
]);

const analogReadBlock: any = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('./blocks/arduino/analog_read.png', 15, 15)
      )
      .appendField('Read number from analog pin#')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return getAvialablePinsFromSetupBlock('analog_read_setup');
        }),
        'PIN'
      );

    this.setOutput(true, 'Number');
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['analog_read'] = analogReadBlock;

const digitalReadBlock: any = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('./blocks/arduino/digital_read.png', 15, 15)
      )
      .appendField('Is electricity running through pin#')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return getAvialablePinsFromSetupBlock('digital_read_setup');
        }),
        'PIN'
      );

    this.setOutput(true, 'Boolean');
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['digital_read'] = digitalReadBlock;

const digitalReadSetupBlock: any = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('./blocks/arduino/digital_read.png', 15, 15)
      )
      .appendField('Setup Digital Read Pin');
    this.appendDummyInput()
      .appendField('PIN #')
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        'PIN'
      );

    this.appendDummyInput('SHOW_CODE_VIEW')
      .appendField('Type')
      .appendField(
        new Blockly.FieldDropdown([
          ['Touch Sensor', 'TOUCH_SENSOR'],
          ['Sensor', 'SENSOR']
        ]),
        'TYPE'
      );
    this.appendDummyInput().appendField('------------------------------------');
    this.appendDummyInput('LOOP_TIMES')
      .appendField('Loop')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        'LOOP'
      );
    this.appendDummyInput()
      .appendField('Has Power? ')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'has_power');
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  getSensorData() {
    return {
      has_power: this.getFieldValue('has_power') === "TRUE",
      loop: this.getFieldValue('LOOP')
    };
  }
};

Blockly.Blocks['digital_read_setup'] = digitalReadSetupBlock;

const analogReadSetupBlock: any = {
  init: function() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage('./blocks/arduino/analog_read.png', 15, 15)
      )
      .appendField('Analog Read Setup');
    this.appendDummyInput()
      .appendField('PIN #')
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().analogPins),
        'PIN'
      );
    this.appendDummyInput('SHOW_CODE_VIEW')
      .appendField('Type')
      .appendField(
        new Blockly.FieldDropdown([
          ['Photo Sensor', 'PHOTO_SENSOR'],
          ['Soil Sensor', 'SOIL_SENSOR'],
          ['Sensor', 'SENSOR']
        ]),
        'TYPE'
      );
    this.appendDummyInput().appendField('------------------------------------');
    this.appendDummyInput('LOOP_TIMES')
      .appendField('Loop')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        'LOOP'
      );

    this.appendDummyInput()
      .appendField('Power Level')
      .appendField(
        new Blockly.FieldNumber(10, 0, 1024, 0.000001),
        'power_level'
      );
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  getSensorData() {
    return {
      power_level: +this.getFieldValue('power_level'),
      loop: this.getFieldValue('LOOP')
    };
  }
};

Blockly.Blocks['analog_read_setup'] = analogReadSetupBlock;
