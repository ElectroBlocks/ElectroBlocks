import { SyncComponent, ResetComponent } from '../svg-sync';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { PinState, PIN_TYPE } from '../../frames/arduino-components.state';
import _ from 'lodash';
import { componentToSvgId } from '../svg-helpers';
import resistorSvg from '../svgs/resistors/resistor-small.svg';
import { ARDUINO_UNO_PINS, ANALOG_PINS } from '../../blockly/selectBoard';
import {
  findResistorBreadboardHoleXY,
  createGroundWire,
  createWire,
} from '../wire';
import { positionComponent } from '../svg-position';

const colors = ['#39b54a', '#ff2a5f', '#1545ff', '#fff76a', '#ff9f3f'];

export const ledCreate: CreateComponentHook<PinState> = (
  state,
  ledEl,
  arduinoEl,
  draw
) => {
  // ledEl = createComponentEl(
  //   draw,
  //   state,
  //   ledSvgString.replace(/radial-gradient/g, `radial-gradient-${state.pin}`)
  // );

  const randomColor = colors[_.random(0, colors.length)];

  ledEl.data('picture-type', state.pinPicture);
  ledEl.data('pin-number', state.pin);

  ledEl
    .find(`#radial-gradient-${state.pin} stop`)
    .toArray()
    .find((stop) => stop.attr('offset') == 1)
    .attr('stop-color', randomColor);
  ledEl.data('color', randomColor);

  createResistor(arduinoEl, draw, state.pin, componentToSvgId(state));
  positionComponent(ledEl, arduinoEl, draw, state.pin, 'POWER');
  if (ANALOG_PINS.includes(state.pin)) {
    ledEl.x(ledEl.x() + 30);
  }

  setPinText(state.pin, ledEl);
};

export const updateLed: SyncComponent = (state, draw) => {
  const ledState = state as PinState;
  const id = componentToSvgId(ledState);
  let ledEl = draw.findOne('#' + id) as Element;
  if (!ledEl) {
    return;
  }

  const stopEl = draw
    .find(`#radial-gradient-${ledState.pin} stop`)
    .toArray()
    .find((sp) => sp.attr('offset') === 1);

  const ledText = ledEl.findOne('#LED_TEXT') as Text;

  if (ledState.pinType === PIN_TYPE.DIGITAL_OUTPUT) {
    const color = ledState.state === 1 ? ledEl.data('color') : '#FFF';
    ledText.node.innerHTML = ledState.state === 1 ? 'ON' : 'OFF';
    stopEl.attr('stop-color', color);
  }

  if (ledState.pinType === PIN_TYPE.ANALOG_OUTPUT) {
    ledText.node.innerHTML = `${ledState.state}`;
    stopEl.attr('stop-color', ledEl.data('color'));
    (ledEl.findOne('#LED_LIGHT') as Element).opacity(ledState.state / 255);
  }

  (ledEl.findOne('#LED_TEXT') as Element).cx(10);
};

export const resetLed: ResetComponent = (componentEl: Element) => {
  componentEl
    .find(`#radial-gradient-${componentEl.data('pin-number')} stop`)
    .toArray()
    .find((stop) => stop.attr('offset') == 1)
    .attr('stop-color', '#FFF');
};

const createResistor = (
  arduino: Svg | Element,
  draw: Svg,
  pin: ARDUINO_UNO_PINS,
  componentId: string
) => {
  const resistorEl = draw.svg(resistorSvg).last();
  resistorEl.data('component-id', componentId);

  const { x, y } = findResistorBreadboardHoleXY(pin, arduino, draw);
  resistorEl.cx(x);
  resistorEl.y(y);
};

export const createWiresLed: CreateWire<PinState> = (
  state,
  draw,
  ledEl,
  arduino,
  id
) => {
  createGroundWire(ledEl, state.pin, arduino as Svg, draw, id, 'right');
  createWire(ledEl, state.pin, 'POWER', arduino, draw, '#FF0000', 'POWER');
};

const setPinText = (pin: ARDUINO_UNO_PINS, ledEl: Element) => {
  const pinText = ledEl.findOne('#PIN_NUMBER') as Text;
  pinText.node.innerHTML = pin;
  if (ANALOG_PINS.includes(pin)) {
    pinText.x(0);
    return;
  }

  if (
    [
      ARDUINO_UNO_PINS.PIN_10,
      ARDUINO_UNO_PINS.PIN_11,
      ARDUINO_UNO_PINS.PIN_12,
    ].includes(pin)
  ) {
    pinText.x(2);
    return;
  }

  pinText.x(15);
};
