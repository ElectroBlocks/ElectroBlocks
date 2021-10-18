import type {
  SyncComponent,
  ResetComponent,
} from '../../core/virtual-circuit/svg-sync';
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from '../../core/virtual-circuit/svg-create';

import type { UltraSonicSensorState } from './state';
import type { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../../core/virtual-circuit/svg-position';
import {
  createComponentWire,
  createGroundOrPowerWire,
} from '../../core/virtual-circuit/wire';

export const positionUltraSonicSensor: PositionComponent<UltraSonicSensorState> = (
  state,
  ultraSonicEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(
    ultraSonicEl,
    arduinoEl,
    draw,
    holes[2],
    isDown,
    'PIN_ECHO'
  );
};

export const createUltraSonicSensor: AfterComponentCreateHook<UltraSonicSensorState> = (
  state,
  ultraSonicEl
) => {
  ultraSonicEl.findOne('#ECHO_PIN_TEXT').node.innerHTML = state.echoPin;
  ultraSonicEl.findOne('#TRIG_PIN_TEXT').node.innerHTML = state.trigPin;
};

export const updateUltraSonicSensor: SyncComponent = (
  state: UltraSonicSensorState,
  ultraSonicEl
) => {
  const distanceTextEl = ultraSonicEl.findOne('#DISTANCE_TEXT') as Element;
  distanceTextEl.show();
  const cxTextDistance = distanceTextEl.cx();
  const distanceEl = ultraSonicEl.findOne('#DISTANCE') as Element;
  // y = 0 is the maximun height and 100 is the lowest height
  const distanceNumber = state.cm > 100 ? 0 : 100 - state.cm;
  distanceEl.y(distanceNumber);
  distanceTextEl.node.innerHTML = `${state.cm} cm`;
  distanceTextEl.cx(cxTextDistance);
};

export const resetUltraSonicSensor: ResetComponent = (ultraSonicEl) => {
  const distanceTextEl = ultraSonicEl.findOne('#DISTANCE_TEXT') as Element;
  distanceTextEl.hide();
};

export const createWiresUltraSonicSensor: CreateWire<UltraSonicSensorState> = (
  state,
  draw,
  componentEl,
  arduionEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;

  createGroundOrPowerWire(
    holes[0],
    isDown,
    componentEl,
    draw,
    arduionEl,
    id,
    'power'
  );

  createComponentWire(
    holes[1],
    isDown,
    componentEl,
    state.trigPin,
    draw,
    arduionEl,
    id,
    'PIN_TRIG',
    board
  );
  createComponentWire(
    holes[2],
    isDown,
    componentEl,
    state.echoPin,
    draw,
    arduionEl,
    id,
    'PIN_ECHO',
    board
  );

  createGroundOrPowerWire(
    holes[3],
    isDown,
    componentEl,
    draw,
    arduionEl,
    id,
    'ground'
  );
};
