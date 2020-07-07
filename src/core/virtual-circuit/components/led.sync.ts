import {
  CreateComponent,
  SyncComponent,
  ResetComponent,
} from '../svg.component';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import {
  PinState,
  PinPicture,
  PIN_TYPE,
} from '../../frames/arduino-components.state';
import ledSvgString from '../svgs/led/led.svg';
import _ from 'lodash';
import { componentToSvgId } from '../svg-helpers';
import resistorSvg from '../svgs/resistors/resistor-small.svg';
import { ARDUINO_UNO_PINS, ANALOG_PINS } from '../../blockly/selectBoard';
import {
  updateWires,
  findResistorBreadboardHoleXY,
  createGroundWire,
  createWire,
} from '../wire';
import { positionComponent } from '../svg-position';

const colors = ['#39b54a', '#ff2a5f', '#1545ff', '#fff76a', '#ff9f3f'];

export const ledCreate: CreateComponent = (state, frame, draw, showArduino) => {
  if (state.type !== ArduinoComponentType.PIN) {
    return;
  }
  const ledState = state as PinState;

  if (ledState.pinPicture !== PinPicture.LED) {
    return;
  }

  const id = componentToSvgId(ledState);
  let ledEl = draw.findOne('#' + id) as Element;
  const arduino = draw.findOne('#arduino_main_svg') as Element;

  if (ledEl && showArduino) {
    return;
  }

  if (ledEl && !showArduino) {
    draw
      .find('line')
      .filter((w) => w.data('component-id') === id)
      .forEach((w) => w.remove());
    return;
  }

  const randomColor = colors[_.random(0, colors.length)];
  ledEl = draw
    .svg(
      ledSvgString.replace(
        /radial-gradient/g,
        `radial-gradient-${ledState.pin}`
      )
    )
    .last();

  ledEl.addClass('component');
  ledEl.data('component-type', state.type);
  ledEl.data('picture-type', ledState.pinPicture);
  ledEl.attr('id', id);
  ledEl.data('pin_number', ledState.pin);
  (window as any).ledEl = ledEl;

  (ledEl as any).draggable().on('dragmove', () => {
    if (showArduino) {
      updateWires(ledEl, draw, arduino as Svg);
    }
  });

  ledEl
    .find(`#radial-gradient-${ledState.pin} stop`)
    .toArray()
    .find((stop) => stop.attr('offset') == 1)
    .attr('stop-color', randomColor);
  ledEl.data('color', randomColor);

  if (showArduino) {
    createResistor(arduino, draw, ledState.pin, id);
    positionComponent(ledEl, arduino, draw, ledState.pin, 'POWER');
    if (ANALOG_PINS.includes(ledState.pin)) {
      ledEl.x(ledEl.x() + 30);
    }
    createWires(ledEl, ledState.pin, arduino as Svg, draw, id);
  }

  setPinText(ledState.pin, ledEl);
};

export const updateLed: SyncComponent = (state, frame, draw) => {
  if (state.type !== ArduinoComponentType.PIN) {
    return;
  }
  const ledState = state as PinState;

  if (ledState.pinPicture !== PinPicture.LED) {
    return;
  }

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
  if (
    componentEl.data('component-type') === ArduinoComponentType.PIN &&
    componentEl.data('picture-type') === PinPicture.LED
  ) {
    componentEl
      .find(`#radial-gradient-${componentEl.data('pin_number')} stop`)
      .toArray()
      .find((stop) => stop.attr('offset') == 1)
      .attr('stop-color', '#FFF');
  }
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

const createWires = (
  ledEl: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string
) => {
  createGroundWire(ledEl, pin, arduino, draw, 'GND', componentId, 'right');
  createWire(ledEl, pin, 'POWER', arduino, draw, '#FF0000', 'POWER');
};

const setPinText = (pin: ARDUINO_UNO_PINS, ledEl: Element) => {
  const pinText = ledEl.findOne('#PIN_NUMBER') as Text;
  pinText.node.innerHTML = pin;
  if (ANALOG_PINS.includes(pin)) {
    pinText.x(-10);
    return;
  }

  if (
    [
      ARDUINO_UNO_PINS.PIN_10,
      ARDUINO_UNO_PINS.PIN_11,
      ARDUINO_UNO_PINS.PIN_12,
    ].includes(pin)
  ) {
    pinText.x(-8);
  }
};
