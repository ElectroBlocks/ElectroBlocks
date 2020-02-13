import Blockly from 'blockly';
import { COLOR_THEME } from '../../../constants/colors';

import selectedBoard from '../../../constants/arduino';

Blockly.defineBlocksWithJsonArray([
  {
    type: 'neo_pixel_setup',
    message0:
      '%1 Setup Led Color Strip %2 Analog Data Pin# %3 %4 Number of leds %5',
    args0: [
      {
        type: 'field_image',
        src: './blocks/neo_pixel/neo_pixel.png',
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
        name: 'PIN',
        options: selectedBoard().analogPins
      },
      {
        type: 'input_dummy'
      },
      {
        type: 'field_number',
        name: 'NUMBER_LEDS',
        value: 30,
        min: 1,
        max: 150
      }
    ],
    colour: COLOR_THEME.COMPONENTS,
    tooltip: '',
    helpUrl: ''
  },
  {
    type: 'neo_pixel_set_color',
    message0: '%1 Set Led Color %2 Which Led? %3 What Color? %4',
    args0: [
      {
        type: 'field_image',
        src: './blocks/neo_pixel/neo_pixel.png',
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
        name: 'POSITION',
        check: 'Number',
        align: 'RIGHT'
      },
      {
        type: 'input_value',
        name: 'COLOR',
        check: 'Colour',
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
