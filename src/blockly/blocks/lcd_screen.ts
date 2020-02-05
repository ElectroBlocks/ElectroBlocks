import Blockly from 'blockly';
import { COLOR_THEME } from '../constants';

Blockly.defineBlocksWithJsonArray([
  {
    type: 'lcd_setup',
    lastDummyAlign0: 'RIGHT',
    message0: '%1 Setup LCD %2 Memory Type %3 %4 Size %5',
    args0: [
      {
        type: 'field_image',
        src: './blocks/lcd/lcd.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'field_dropdown',
        name: 'MEMORY_TYPE',
        options: [
          ['0x3F', '0x3F'],
          ['0x27', '0x27']
        ]
      },
      {
        type: 'input_dummy',
        align: 'RIGHT'
      },
      {
        type: 'field_dropdown',
        name: 'SIZE',
        options: [
          ['16 x 2', '16 x 2'],
          ['20 x 4', '20 x 4']
        ]
      }
    ],
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'lcd_scroll',
    message0: '%1 LCD move everything 1 space %2',
    args0: [
      {
        type: 'field_image',
        src: './blocks/lcd/lcd.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'field_dropdown',
        name: 'DIR',
        options: [
          ['RIGHT', 'RIGHT'],
          ['LEFT', 'LEFT']
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'lcd_blink',
    message0: '%1 LCD %2 %3 Row %4 Column %5',
    args0: [
      {
        type: 'field_image',
        src: './blocks/lcd/lcd.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'field_dropdown',
        name: 'BLINK',
        options: [
          ['Blink', 'BLINK'],
          ['No Blink', 'OFF']
        ]
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'input_value',
        name: 'ROW',
        check: 'Number',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'COLUMN',
        check: 'Number',
        align: 'RIGHT'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'lcd_screen_simple_print',
    message0:
      '%1 LCD Print  ->  Delay ->  Clear %2 Print on Row 1 %3 Print on Row 2 %4 Print on Row 3 %5 Print on Row 4 %6 Delay in seconds %7',
    args0: [
      {
        type: 'field_image',
        src: './blocks/lcd/lcd.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'input_value',
        name: 'ROW_1',
        check: 'String',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'ROW_2',
        check: 'String',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'ROW_3',
        check: 'String',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'ROW_4',
        check: 'String',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'DELAY',
        check: 'Number',
        align: 'RIGHT'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'lcd_backlight',
    message0: '%1 LCD turn backlight %2',
    args0: [
      {
        type: 'field_image',
        src: './blocks/lcd/lcd.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'field_dropdown',
        name: 'BACKLIGHT',
        options: [
          ['on', 'ON'],
          ['off', 'OFF']
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'lcd_screen_print',
    message0: '%1 LCD Print %2 Row %3 Column %4 Message %5',
    args0: [
      {
        type: 'field_image',
        src: './blocks/lcd/lcd.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'input_value',
        name: 'ROW',
        check: 'Number',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'COLUMN',
        check: 'Number',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'PRINT',
        check: 'String',
        align: 'RIGHT'
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'lcd_screen_clear',
    message0: '%1 LCD Clear',
    args0: [
      {
        type: 'field_image',
        src: './blocks/lcd/lcd.png',
        width: 15,
        height: 15,
        alt: '*',
        flipRtl: false
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  }
]);
