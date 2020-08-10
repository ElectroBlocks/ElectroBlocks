import { SyncComponent, ResetComponent } from '../svg-sync';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { UltraSonicSensorState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../svg-position';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createUltraSonicSensor: CreateComponentHook<UltraSonicSensorState> = (
  state,
  ultraSonicEl,
  arduinoEl,
  draw
) => {
  //todo consider labeling pins in picture
  positionComponent(ultraSonicEl, arduinoEl, draw, state.trigPin, 'PIN_TRIG');
};

export const updateUltraSonicSensor: SyncComponent = (state, draw) => {
  const ultraSonicState = state as UltraSonicSensorState;

  const id = componentToSvgId(ultraSonicState);
  let ultraSonicEl = draw.findOne('#' + id) as Element;
  syncDistance(ultraSonicEl, ultraSonicState.cm);
};

const syncDistance = (ultraSonicEl: Element, distance: number) => {
  const firstDistance = 224;
  const distanceTextEl = ultraSonicEl.findOne('#DISTANCE_TEXT') as Element;
  distanceTextEl.show();
  const cxTextDistance = distanceTextEl.cx();
  const distanceEl = ultraSonicEl.findOne('#DISTANCE') as Element;
  const distanceNumber =
    firstDistance - distance > 100 ? firstDistance - distance : 100;
  distanceEl.y(distanceNumber);
  distanceTextEl.node.innerHTML = `${distance} cm`;
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
