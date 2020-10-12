import { COLOR_THEME } from './constants/colors';
import type { BlocklyThemeOptions } from 'blockly';

export const theme: BlocklyThemeOptions = {
  blockStyles: {
    logic_blocks: {
      colourPrimary: COLOR_THEME.CONTROL,
      colourSecondary: COLOR_THEME.CONTROL,
      colourTertiary: COLOR_THEME.CONTROL,
      hat: '',
    },
    loop_blocks: {
      colourPrimary: COLOR_THEME.CONTROL,
      colourSecondary: COLOR_THEME.CONTROL,
      colourTertiary: COLOR_THEME.CONTROL,
      hat: '',
    },
    procedure_blocks: {
      colourPrimary: COLOR_THEME.CONTROL,
      colourSecondary: COLOR_THEME.CONTROL,
      colourTertiary: COLOR_THEME.CONTROL,
      hat: '',
    },
    math_blocks: {
      colourPrimary: COLOR_THEME.VALUES,
      colourSecondary: COLOR_THEME.VALUES,
      colourTertiary: COLOR_THEME.VALUES,
      hat: '',
    },
    text_blocks: {
      colourPrimary: COLOR_THEME.VALUES,
      colourSecondary: COLOR_THEME.VALUES,
      colourTertiary: COLOR_THEME.VALUES,
      hat: '',
    },
    colour_blocks: {
      colourPrimary: COLOR_THEME.VALUES,
      colourSecondary: COLOR_THEME.VALUES,
      colourTertiary: COLOR_THEME.VALUES,
      hat: '',
    },
    variable_blocks: {
      colourPrimary: COLOR_THEME.DATA,
      colourSecondary: COLOR_THEME.DATA,
      colourTertiary: COLOR_THEME.DATA,
      hat: '',
    },
    list_blocks: {
      colourPrimary: COLOR_THEME.DATA,
      colourSecondary: COLOR_THEME.DATA,
      colourTertiary: COLOR_THEME.DATA,
      hat: '',
    },
  },
};
