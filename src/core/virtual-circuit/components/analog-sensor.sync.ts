import { SyncComponent, ResetComponent } from '../svg.component';
import { CreateComponentHook, CreateWire } from '../svg-create';
import { componentToSvgId, findArduinoEl } from '../svg-helpers';
import {
  PinState,
  PIN_TYPE,
  PinPicture,
} from '../../frames/arduino-components.state';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { createWire, createGroundWire, createPowerWire } from '../wire';
import { positionComponent } from '../svg-position';
import _ from 'lodash';

import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';

export const analogDigitalSensorCreate: CreateComponentHook<PinState> = (
  state,
  analogSensorEl,
  arduinoEl,
  draw
) => {
  analogSensorEl.data('picture-type', state.pinPicture);
  analogSensorEl.findOne('#PIN_TEXT').node.innerHTML = state.pin.toString();
  positionComponent(analogSensorEl, arduinoEl, draw, state.pin, 'PIN_DATA');

  if (pinCenterText[state.pinPicture]) {
    (analogSensorEl.findOne('#PIN_TEXT') as Element).cx(
      pinCenterText[state.pinPicture]
    );
  }

  if (![ARDUINO_UNO_PINS.PIN_A1, ARDUINO_UNO_PINS.PIN_A0].includes(state.pin)) {
    analogSensorEl.x(analogSensorEl.x() - 20);
  }
};

export const analogDigitalSensorUpdate: SyncComponent = (state, draw) => {
  const analogSensorState = state as PinState;
  const id = componentToSvgId(analogSensorState);
  let analogSensorEl = draw.findOne('#' + id) as Element;
  setSensorText(analogSensorEl, analogSensorState);
};

export const analogDigitalSensorReset: ResetComponent = (
  componentEl: Element
) => {
  componentEl.findOne('#READING_VALUE').hide();
  if (componentEl.findOne('#finger')) {
    componentEl.findOne('#finger').hide();
  }
};

const setSensorText = (componentEl: Element, state: PinState) => {
  const textEl = componentEl.findOne('#READING_VALUE') as Text;
  textEl.show();
  if (
    state.pinType === PIN_TYPE.DIGITAL_INPUT &&
    state.pinPicture === PinPicture.SENSOR
  ) {
    textEl.node.innerHTML = state.state === 1 ? 'ON' : 'OFF';
    textEl.cx(centerReadingText[state.pinPicture]);
    return;
  }

  if (state.pinPicture === PinPicture.TOUCH_SENSOR) {
    if (state.state === 1) {
      textEl.show();
      componentEl.findOne('#finger').show();
    } else {
      textEl.hide();
      componentEl.findOne('#finger').hide();
    }

    return;
  }

  textEl.node.innerHTML = state.state.toString();
  textEl.cx(centerReadingText[state.pinPicture]);
};

const createSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    'PIN_DATA',
    arduinoEl,
    draw,
    '#228e0c',
    'data-pin'
  );
  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'right');
  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'left');
};

const createSoilSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    'PIN_DATA',
    arduinoEl,
    draw,
    '#228e0c',
    'data-pin'
  );

  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'right');
  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'right');
};

const createPhotoSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    'PIN_DATA',
    arduinoEl,
    draw,
    '#228e0c',
    'data-pin'
  );

  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'left');
  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'left');
};

const createTouchSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    'PIN_DATA',
    arduinoEl,
    draw,
    '#228e0c',
    'data-pin'
  );

  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'right');
  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, 'right');
};

export const createWireSensors: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  return createWiresFunc[state.pinPicture](
    state,
    draw,
    componentEl,
    arduinoEl,
    id
  );
};

const createWiresFunc = {
  [PinPicture.SOIL_SENSOR]: createSoilSensorWires,
  [PinPicture.SENSOR]: createSensorWires,
  [PinPicture.PHOTO_SENSOR]: createPhotoSensorWires,
  [PinPicture.TOUCH_SENSOR]: createTouchSensorWires,
};

const centerReadingText = {
  [PinPicture.SOIL_SENSOR]: 10,
  [PinPicture.SENSOR]: 18,
  [PinPicture.PHOTO_SENSOR]: 18,
  [PinPicture.TOUCH_SENSOR]: 10,
};

const pinCenterText = {
  [PinPicture.SENSOR]: 18,
  [PinPicture.TOUCH_SENSOR]: 10,
};
