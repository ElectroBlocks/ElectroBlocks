import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../../core/virtual-circuit/svg-create";

import type { UltraSonicSensorState } from "./state";
import type { Element, Svg } from "@svgdotjs/svg.js";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  createWire,
  createPowerWire,
  createGroundWire,
} from "../../core/virtual-circuit/wire";

export const positionUltraSonicSensor: PositionComponent<UltraSonicSensorState> = (
  state,
  ultraSonicEl,
  arduinoEl,
  draw,
  board
) => {
  //todo consider labeling pins in picture
  positionComponent(
    ultraSonicEl,
    arduinoEl,
    draw,
    state.trigPin,
    "PIN_TRIG",
    board
  );
};

export const createUltraSonicSensor: CreateCompenentHook<UltraSonicSensorState> = (
  state,
  ultraSonicEl
) => {
  ultraSonicEl.findOne("#ECHO_PIN_TEXT").node.innerHTML = state.echoPin;
  ultraSonicEl.findOne("#TRIG_PIN_TEXT").node.innerHTML = state.trigPin;
};

export const updateUltraSonicSensor: SyncComponent = (
  state: UltraSonicSensorState,
  ultraSonicEl
) => {
  const firstDistance = 224;
  const distanceTextEl = ultraSonicEl.findOne("#DISTANCE_TEXT") as Element;
  distanceTextEl.show();
  const cxTextDistance = distanceTextEl.cx();
  const distanceEl = ultraSonicEl.findOne("#DISTANCE") as Element;
  const distanceNumber =
    firstDistance - state.cm > 100 ? firstDistance - state.cm : 100;
  distanceEl.y(distanceNumber);
  distanceTextEl.node.innerHTML = `${state.cm} cm`;
  distanceTextEl.cx(cxTextDistance);
};

export const resetUltraSonicSensor: ResetComponent = (ultraSonicEl) => {
  const distanceTextEl = ultraSonicEl.findOne("#DISTANCE_TEXT") as Element;
  distanceTextEl.hide();
};

export const createWiresUltraSonicSensor: CreateWire<UltraSonicSensorState> = (
  state,
  draw,
  componentEl,
  arduionEl,
  id,
  board
) => {
  createPowerWire(
    componentEl,
    state.trigPin,
    arduionEl as Svg,
    draw,
    id,
    "left",
    board
  );
  createWire(
    componentEl,
    state.trigPin,
    "PIN_TRIG",
    arduionEl,
    draw,
    "#177a6c",
    "trig-pin",
    board
  );
  createWire(
    componentEl,
    state.echoPin,
    "PIN_ECHO",
    arduionEl,
    draw,
    "#a03368",
    "echo-pin",
    board
  );
  createGroundWire(
    componentEl,
    state.echoPin,
    arduionEl as Svg,
    draw,
    id,
    "right",
    board
  );
};
