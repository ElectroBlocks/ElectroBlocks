import { SyncComponent, ResetComponent } from '../svg.component';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import { LedColorState } from '../../frames/arduino-components.state';
import resistorSmallSvg from '../svgs/resistors/resistor-small.svg';
import {
  createGroundWire,
  createWire,
  findResistorBreadboardHoleXY,
} from '../wire';
import { rgbToHex } from '../../blockly/helpers/color.helper';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';

export const createRgbLed: CreateComponentHook<LedColorState> = (
  state,
  rgbLedEl,
  arduinoEl,
  draw
) => {
  //todo consider labeling pin in picture

  rgbLedEl.data('picture-type', state.pictureType);
  positionComponent(rgbLedEl, arduinoEl, draw, state.redPin, 'PIN_RED');
  createResistors(arduinoEl, draw, state, componentToSvgId(state));
};

export const updateRgbLed: SyncComponent = (state, draw) => {
  const rgbLedState = state as LedColorState;

  const id = componentToSvgId(state);
  let rgbLedEl = draw.findOne('#' + id) as Element;

  if (rgbLedEl) {
    changeColor(rgbToHex(rgbLedState.color), rgbLedEl, rgbLedState);
  }
};

export const resetRgbLed: ResetComponent = (rgbLedEl) => {
  if (rgbLedEl.data('picture-type') === 'BUILT_IN') {
    (rgbLedEl.findOne('#COLOR_LED circle') as Element).fill('#FFF');
    return;
  }

  (rgbLedEl.findOne('#COLOR_LED') as Element).fill('#FFF');
};

const createResistors = (
  arduino: Svg | Element,
  draw: Svg,
  state: LedColorState,
  componentId: string
) => {
  if (state.pictureType !== 'BREADBOARD') {
    return;
  }

  createResistor(arduino, draw, state.greenPin, componentId);
  createResistor(arduino, draw, state.bluePin, componentId);
  createResistor(arduino, draw, state.redPin, componentId);
};

const createResistor = (
  arduino: Svg | Element,
  draw: Svg,
  pin: ARDUINO_UNO_PINS,
  componentId: string
) => {
  const resistorEl = draw.svg(resistorSmallSvg).last();
  resistorEl.data('component-id', componentId);

  const { x, y } = findResistorBreadboardHoleXY(pin, arduino, draw);
  resistorEl.cx(x);
  resistorEl.y(y);
};

export const createWiresRgbLed: CreateWire<LedColorState> = (
  state,
  draw,
  rgbLedEl,
  arduino,
  id
) => {
  createWire(
    rgbLedEl,
    state.bluePin,
    'PIN_BLUE',
    arduino,
    draw,
    '#4c5dbf',
    'blue-pin'
  );

  createWire(
    rgbLedEl,
    state.redPin,
    'PIN_RED',
    arduino,
    draw,
    '#ef401d',
    'red-pin'
  );

  createWire(
    rgbLedEl,
    state.greenPin,
    'PIN_GREEN',
    arduino,
    draw,
    '#4dc16e',
    'green-pin'
  );

  createGroundWire(rgbLedEl, state.redPin, arduino as Svg, draw, id, 'right');
};

const changeColor = (
  color: string,
  rgbLedEl: Element,
  state: LedColorState
) => {
  if (color.toUpperCase() === '#000000') {
    color = '#FFFFFF';
  }

  if (state.pictureType === 'BUILT_IN') {
    (rgbLedEl.findOne('#COLOR_LED circle') as Element).fill(color);
    return;
  }
  (rgbLedEl.findOne('#COLOR_LED') as Element).fill(color);
};
