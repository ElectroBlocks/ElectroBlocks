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
import analogSensorSvgString from '../svgs/digital_analog_sensor/digital_analog_sensor.svg';
import soilSensorSvgString from '../svgs/soilsensor/soilsensor.svg';
import photoSensorSvgString from '../svgs/photosensor/photosensor.svg';

import { addDraggableEvent } from '../component-events.helpers';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';

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

  if (analogSensorState.pinPicture === PinPicture.SENSOR) {
    (analogSensorEl.findOne('#PIN_TEXT') as Element).cx(18);
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
  if (state.pinType === PIN_TYPE.DIGITAL_INPUT) {
    textEl.node.innerHTML = state.state === 1 ? 'ON' : 'OFF';
  } else {
    textEl.node.innerHTML = state.state.toString();
  }
  textEl.cx(centerReadingText[state.pinPicture]);
};

const createSensorWires = (
  compoentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
  createWire(
    compoentEl,
    state.pin,
    'PIN_DATA',
    arduinoEl,
    draw,
    '#228e0c',
    'data-pin'
  );
  createGroundWire(
    compoentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    'PIN_GND',
    id,
    'right'
  );
  createPowerWire(
    compoentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    'PIN_POWER',
    id,
    'left'
  );
};

const createSoilSensorWires = (
  compoentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
  createWire(
    compoentEl,
    state.pin,
    'PIN_DATA',
    arduinoEl,
    draw,
    '#228e0c',
    'data-pin'
  );

  createGroundWire(
    compoentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    'PIN_GND',
    id,
    'right'
  );
  createPowerWire(
    compoentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    'PIN_POWER',
    id,
    'right'
  );
};

const createPhotoSensorWires = (
  compoentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
  createWire(
    compoentEl,
    state.pin,
    'PIN_DATA',
    arduinoEl,
    draw,
    '#228e0c',
    'data-pin'
  );

  createGroundWire(
    compoentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    'PIN_GND',
    id,
    'left'
  );
  createPowerWire(
    compoentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    'PIN_POWER',
    id,
    'left'
  );
};

const createWiresFunc = {
  [PinPicture.SOIL_SENSOR]: createSoilSensorWires,
  [PinPicture.SENSOR]: createSensorWires,
  [PinPicture.PHOTO_SENSOR]: createPhotoSensorWires,
};

const svgStringHash = {
  [PinPicture.SOIL_SENSOR]: soilSensorSvgString,
  [PinPicture.SENSOR]: analogSensorSvgString,
  [PinPicture.PHOTO_SENSOR]: photoSensorSvgString,
};

const centerReadingText = {
  [PinPicture.SOIL_SENSOR]: 10,
  [PinPicture.SENSOR]: 18,
  [PinPicture.PHOTO_SENSOR]: 18,
};
