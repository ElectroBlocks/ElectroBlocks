import { SyncComponent, ResetComponent } from '../svg-sync';
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from '../svg-create';

import { UltraSonicSensorState } from '../../frames/arduino-components.state';
import { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../svg-position';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const positionUltraSonicSensor: PositionComponent<UltraSonicSensorState> = (
  state,
  ultraSonicEl,
  arduinoEl,
  draw
) => {
  //todo consider labeling pins in picture
  positionComponent(ultraSonicEl, arduinoEl, draw, state.trigPin, 'PIN_TRIG');
};

export const createUltraSonicSensor: CreateCompenentHook<UltraSonicSensorState> = (
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
  const firstDistance = 224;
  const distanceTextEl = ultraSonicEl.findOne('#DISTANCE_TEXT') as Element;
  distanceTextEl.show();
  const cxTextDistance = distanceTextEl.cx();
  const distanceEl = ultraSonicEl.findOne('#DISTANCE') as Element;
  const distanceNumber =
    firstDistance - state.cm > 100 ? firstDistance - state.cm : 100;
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
  id
) => {
  createPowerWire(
    componentEl,
    state.trigPin,
    arduionEl as Svg,
    draw,
    id,
    'left'
  );
  createWire(
    componentEl,
    state.trigPin,
    'PIN_TRIG',
    arduionEl,
    draw,
    '#177a6c',
    'trig-pin'
  );
  createWire(
    componentEl,
    state.echoPin,
    'PIN_ECHO',
    arduionEl,
    draw,
    '#a03368',
    'echo-pin'
  );
  createGroundWire(
    componentEl,
    state.echoPin,
    arduionEl as Svg,
    draw,
    id,
    'right'
  );
};
