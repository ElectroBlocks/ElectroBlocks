import {
  CreateComponent,
  SyncComponent,
  ResetComponent,
} from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import {
  LedColorState,
  PinPicture,
} from '../../frames/arduino-components.state';
import rgbLedSvg from '../svgs/rgbled/rgbled.svg';
import rgbLedNoResistorSvg from '../svgs/rgbled/rgbled-no-resistor.svg';
import resistorSmallSvg from '../svgs/resistors/resistor-small.svg';
import {
  createGroundWire,
  createWire,
  updateWires,
  findResistorBreadboardHoleXY,
} from '../wire';
import { rgbToHex } from '../../blockly/helpers/color.helper';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';

export const createRgbLed: CreateComponent = (
  state,
  frame,
  draw,
  showArduino
) => {
  if (state.type !== ArduinoComponentType.LED_COLOR) {
    return;
  }

  const ledRgbState = state as LedColorState;

  const id = componentToSvgId(ledRgbState);
  let rgbLedEl = draw.findOne('#' + id) as Element;
  const arduino = draw.findOne('#arduino_main_svg') as Element;

  if (rgbLedEl && showArduino) {
    createWires(rgbLedEl, arduino, draw, ledRgbState, id);

    positionComponent(rgbLedEl, arduino, draw, ledRgbState.redPin, 'RED_PIN');
    createResistors(arduino, draw, ledRgbState, id);
    return;
  }

  if (rgbLedEl && !showArduino) {
    draw
      .find('line')
      .filter((w) => w.data('component-id') === id)
      .forEach((w) => w.remove());
    return;
  }

  const svgString =
    ledRgbState.pictureType === 'BREADBOARD' ? rgbLedSvg : rgbLedNoResistorSvg;

  rgbLedEl = draw.svg(svgString).last();
  rgbLedEl.addClass('component');
  rgbLedEl.data('component-type', state.type);

  rgbLedEl.attr('id', id);
  (rgbLedEl as Svg).viewbox(0, 0, rgbLedEl.width(), rgbLedEl.height());
  (window as any).rgbLed = rgbLedEl;

  (rgbLedEl as any).draggable().on('dragmove', () => {
    if (showArduino) {
      updateWires(rgbLedEl, draw, arduino as Svg);
    }
  });

  if (showArduino) {
    positionComponent(rgbLedEl, arduino, draw, ledRgbState.redPin, 'RED_PIN');
    createWires(rgbLedEl, arduino, draw, ledRgbState, id);
    createResistors(arduino, draw, ledRgbState, id);
  }
};

export const updateRgbLed: SyncComponent = (state, frame, draw) => {
  if (state.type !== ArduinoComponentType.LED_COLOR) {
    return;
  }

  const rgbLedState = state as LedColorState;

  const id = componentToSvgId(state);
  let rgbLedEl = draw.findOne('#' + id) as Element;

  if (rgbLedEl) {
    changeColor(rgbToHex(rgbLedState.color), rgbLedEl, rgbLedState);
  }
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

const createWires = (
  rgbLedEl: Element,
  arduino: Svg | Element,
  draw: Svg,
  state: LedColorState,
  componentId: string
) => {
  createWire(
    rgbLedEl,
    state.bluePin,
    'BLUE_PIN',
    arduino,
    draw,
    '#4c5dbf',
    'blue-pin'
  );

  createWire(
    rgbLedEl,
    state.redPin,
    'RED_PIN',
    arduino,
    draw,
    '#ef401d',
    'red-pin'
  );

  createWire(
    rgbLedEl,
    state.greenPin,
    'GREEN_PIN',
    arduino,
    draw,
    '#4dc16e',
    'green-pin'
  );

  createGroundWire(
    rgbLedEl,
    state.redPin,
    arduino as Svg,
    draw,
    'GND_PIN',
    componentId,
    'right'
  );
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
