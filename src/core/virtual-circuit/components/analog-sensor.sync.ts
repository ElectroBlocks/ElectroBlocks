import { SyncComponent, CreateComponent } from '../svg.component';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import {
  PinState,
  PIN_TYPE,
  PinPicture,
} from '../../frames/arduino-components.state';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { createWire, createGroundWire, createPowerWire } from '../wire';
import { positionComponent } from '../svg-position';
import _ from 'lodash';

import { addDraggableEvent } from '../component-events.helpers';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';

import analogSensorSvgString from '../svgs/digital_analog_sensor/digital_analog_sensor.svg';
import soilSensorSvgString from '../svgs/soilsensor/soilsensor.svg';
import photoSensorSvgString from '../svgs/photosensor/photosensor.svg';
import touchSensorSvgString from '../svgs/touch-sensor/touch-sensor.svg';

export const analogDigitalSensorCreate: CreateComponent = (
  state,
  frame,
  draw
) => {
  const analogSensorState = state as PinState;
  const id = componentToSvgId(analogSensorState);
  let analogSensorEl = draw.findOne('#' + id) as Element;
  const arduinoEl = findArduinoEl(draw);
  if (analogSensorEl) {
    setSensorText(analogSensorEl, analogSensorState);
    return;
  }

  analogSensorEl = createComponentEl(
    draw,
    analogSensorState,
    svgStringHash[analogSensorState.pinPicture]
  );
  analogSensorEl.findOne(
    '#PIN_TEXT'
  ).node.innerHTML = analogSensorState.pin.toString();
  addDraggableEvent(analogSensorEl, arduinoEl, draw);
  setSensorText(analogSensorEl, analogSensorState);
  positionComponent(
    analogSensorEl,
    arduinoEl,
    draw,
    analogSensorState.pin,
    'PIN_DATA'
  );

  if (pinCenterText[analogSensorState.pinPicture]) {
    (analogSensorEl.findOne('#PIN_TEXT') as Element).cx(
      pinCenterText[analogSensorState.pinPicture]
    );
  }

  (window as any).analogSensor = analogSensorEl;

  if (
    ![ARDUINO_UNO_PINS.PIN_A1, ARDUINO_UNO_PINS.PIN_A0].includes(
      analogSensorState.pin
    )
  ) {
    analogSensorEl.x(analogSensorEl.x() - 20);
  }
  createWiresFunc[analogSensorState.pinPicture](
    analogSensorEl,
    analogSensorState,
    draw,
    id
  );
};

export const analogDigitalSensorUpdate: SyncComponent = (
  state,
  frame,
  draw
) => {
  const analogSensorState = state as PinState;
  const id = componentToSvgId(analogSensorState);
  let analogSensorEl = draw.findOne('#' + id) as Element;
  setSensorText(analogSensorEl, analogSensorState);
};

const setSensorText = (componentEl: Element, state: PinState) => {
  const textEl = componentEl.findOne('#READING_VALUE') as Text;

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

const createSensorWires = (
  componentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
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

const createSoilSensorWires = (
  componentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
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

const createPhotoSensorWires = (
  componentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
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

const createTouchSensorWires = (
  componentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
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

const createWiresFunc = {
  [PinPicture.SOIL_SENSOR]: createSoilSensorWires,
  [PinPicture.SENSOR]: createSensorWires,
  [PinPicture.PHOTO_SENSOR]: createPhotoSensorWires,
  [PinPicture.TOUCH_SENSOR]: createTouchSensorWires,
};

const svgStringHash = {
  [PinPicture.SOIL_SENSOR]: soilSensorSvgString,
  [PinPicture.SENSOR]: analogSensorSvgString,
  [PinPicture.PHOTO_SENSOR]: photoSensorSvgString,
  [PinPicture.TOUCH_SENSOR]: touchSensorSvgString,
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
