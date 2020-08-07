import { CreateComponent, SyncComponent } from '../svg.component';
import { PinState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import soilSensorSvgString from '../svgs/soilsensor/soilsensor.svg';
import { addDraggableEvent } from '../component-events.helpers';
import { createWire, createGroundWire, createPowerWire } from '../wire';
import { positionComponent } from '../svg-position';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';

export const soilSensorCreate: CreateComponent = (state, frame, draw) => {
  const soilSensorState = state as PinState;
  const id = componentToSvgId(soilSensorState);
  let soilSensorEl = draw.findOne('#' + id) as Element;
  const arduinoEl = findArduinoEl(draw);
  if (soilSensorEl) {
    setSensorLevelText(soilSensorEl, soilSensorState);
    return;
  }
  soilSensorEl = createComponentEl(draw, soilSensorState, soilSensorSvgString);
  (window as any).soilSensorEl = soilSensorEl;

  soilSensorEl.findOne(
    '#PIN_TEXT'
  ).node.innerHTML = soilSensorState.pin.toString();
  addDraggableEvent(soilSensorEl, arduinoEl, draw);
  setSensorLevelText(soilSensorEl, soilSensorState);
  positionComponent(
    soilSensorEl,
    arduinoEl,
    draw,
    soilSensorState.pin,
    'PIN_DO'
  );
  if (
    ![ARDUINO_UNO_PINS.PIN_A1, ARDUINO_UNO_PINS.PIN_A0].includes(
      soilSensorState.pin
    )
  ) {
    soilSensorEl.x(soilSensorEl.x() - 20);
  }
  createWires(soilSensorEl, soilSensorState, draw, id);
};

export const soilSensorUpdate: SyncComponent = (state, frame, draw) => {};

const setSensorLevelText = (componentEl: Element, state: PinState) => {
  componentEl.findOne(
    '#SOIL_SENSOR_LEVEL'
  ).node.innerHTML = state.state.toString();
  (componentEl.findOne('#SOIL_SENSOR_LEVEL') as Element).cx(10);
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
    'right'
  );
  createPowerWire(
    compoentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    'PIN_VCC',
    id,
    'right'
  );
};
