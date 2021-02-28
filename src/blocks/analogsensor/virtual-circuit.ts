import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";
import type { Element, Svg, Text } from "@svgdotjs/svg.js";
import {
  createWire,
  createGroundWire,
  createPowerWire,
} from "../../core/virtual-circuit/wire";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import _ from "lodash";

import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { AnalogSensorPicture, AnalogSensorState } from "./state";

export const analogSensorCreate: AfterComponentCreateHook<AnalogSensorState> = (
  state,
  analogSensorEl
) => {
  analogSensorEl.findOne("#PIN_TEXT").node.innerHTML = state.pin.toString();
  analogSensorEl.data("picture-type", state.pictureType);
};

export const analogSensorPosition: PositionComponent<AnalogSensorState> = (
  state,
  analogSensorEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(
    analogSensorEl,
    arduinoEl,
    draw,
    state.pin,
    "PIN_DATA",
    board
  );
  if (![ARDUINO_PINS.PIN_A1, ARDUINO_PINS.PIN_A0].includes(state.pin)) {
    analogSensorEl.x(analogSensorEl.x() - 20);
  }
};

export const analogSensorUpdate: SyncComponent = (
  state: AnalogSensorState,
  analogSensorEl,
  draw
) => {
  const textEl = analogSensorEl.findOne("#READING_VALUE") as Text;
  textEl.show();

  textEl.node.innerHTML = state.state.toString();
  textEl.cx(centerReadingText[state.pictureType]);
};

export const analogSensorReset: ResetComponent = (componentEl: Element) => {
  componentEl.findOne("#READING_VALUE").hide();
  if (componentEl.findOne("#finger")) {
    componentEl.findOne("#finger").hide();
  }
};

const createSensorWires: CreateWire<AnalogSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board
) => {
  createWire(
    componentEl,
    state.pin,
    "PIN_DATA",
    arduinoEl,
    draw,
    "#228e0c",
    "data-pin",
    board
  );
  createGroundWire(
    componentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    id,
    "right",
    board
  );
  createPowerWire(
    componentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    id,
    "left",
    board
  );
};

const createSoilSensorWires: CreateWire<AnalogSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board
) => {
  createWire(
    componentEl,
    state.pin,
    "PIN_DATA",
    arduinoEl,
    draw,
    "#228e0c",
    "data-pin",
    board
  );

  createGroundWire(
    componentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    id,
    "right",
    board
  );
  createPowerWire(
    componentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    id,
    "right",
    board
  );
};

const createPhotoSensorWires: CreateWire<AnalogSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board
) => {
  createWire(
    componentEl,
    state.pin,
    "PIN_DATA",
    arduinoEl,
    draw,
    "#228e0c",
    "data-pin",
    board
  );

  createGroundWire(
    componentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    id,
    "left",
    board
  );
  createPowerWire(
    componentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    id,
    "left",
    board
  );
};

export const createWireAnalogSensors: CreateWire<AnalogSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board
) => {
  return createWiresFunc[state.pictureType](
    state,
    draw,
    componentEl,
    arduinoEl,
    id,
    board
  );
};

const createWiresFunc = {
  [AnalogSensorPicture.SOIL_SENSOR]: createSoilSensorWires,
  [AnalogSensorPicture.SENSOR]: createSensorWires,
  [AnalogSensorPicture.PHOTO_SENSOR]: createPhotoSensorWires,
};

const centerReadingText = {
  [AnalogSensorPicture.SOIL_SENSOR]: 10,
  [AnalogSensorPicture.SENSOR]: 18,
  [AnalogSensorPicture.PHOTO_SENSOR]: 18,
};
