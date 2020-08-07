import { CreateComponent, SyncComponent } from '../svg.component';
import { PinState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import photoSensorSvgString from '../svgs/photosensor/photosensor.svg';
import { addDraggableEvent } from '../component-events.helpers';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { positionComponent } from '../svg-position';
import { createWire, createGroundWire, createPowerWire } from '../wire';

export const photoSensorCreate: CreateComponent = (state, frame, draw) => {
  const photoSensorState = state as PinState;
  const id = componentToSvgId(photoSensorState);
  let photoSensorEl = draw.findOne('#' + id) as Element;
  const arduinoEl = findArduinoEl(draw);
  if (photoSensorEl) {
    setSensorText(photoSensorEl, photoSensorState);
    return;
  }
  photoSensorEl = createComponentEl(
    draw,
    photoSensorState,
    photoSensorSvgString
  );
  photoSensorEl.findOne(
    '#PIN_TEXT'
  ).node.innerHTML = photoSensorState.pin.toString();
  (window as any).photoSensor = photoSensorEl;

  addDraggableEvent(photoSensorEl, arduinoEl, draw);
  setSensorText(photoSensorEl, photoSensorState);
  positionComponent(
    photoSensorEl,
    arduinoEl,
    draw,
    photoSensorState.pin,
    'PIN_DO'
  );
  if (
    ![ARDUINO_UNO_PINS.PIN_A1, ARDUINO_UNO_PINS.PIN_A0].includes(
      photoSensorState.pin
    )
  ) {
    photoSensorEl.x(photoSensorEl.x() - 10);
  }
  createWires(photoSensorEl, photoSensorState, draw, id);
};

export const photoSensorUpdate: SyncComponent = (state, frame, draw) => {
  const photoSensorState = state as PinState;
  const id = componentToSvgId(photoSensorState);
  let photoSensorEl = draw.findOne('#' + id) as Element;
  setSensorText(photoSensorEl, photoSensorState);
};

const setSensorText = (componentEl: Element, state: PinState) => {
  componentEl.findOne('#POWER_NUMBER').node.innerHTML = state.state.toString();
  (componentEl.findOne('#POWER_NUMBER') as Element).cx(18);
};

const createWires = (
  compoentEl: Element,
  state: PinState,
  draw: Svg,
  id: string
) => {
  const arduinoEl = findArduinoEl(draw);
  createWire(
    compoentEl,
    state.pin,
    'PIN_DO',
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
