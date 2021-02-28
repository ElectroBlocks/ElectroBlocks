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
import _ from "lodash";

import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { AnalogSensorPicture, AnalogSensorState } from "./state";
import { positionComponent } from "../../core/virtual-circuit/svg-position-v2";
import {
  createComponentWire,
  createGroundOrPowerWire,
  createWireBreadboard,
  createWireComponentToBreadboard,
} from "../../core/virtual-circuit/wire-v2";

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
  board,
  area
) => {
  const { holes } = area;
  const sensorPinHole = `pin${holes[3]}E`;
  if (state.pictureType === AnalogSensorPicture.SENSOR) {
    positionComponent(
      analogSensorEl,
      arduinoEl,
      draw,
      sensorPinHole,
      "PIN_DATA"
    );
  } else {
    positionComponent(
      analogSensorEl,
      arduinoEl,
      draw,
      sensorPinHole,
      "PIN_GND"
    );
  }

  // // positionComponent(
  // //   analogSensorEl,
  // //   arduinoEl,
  // //   draw,
  // //   state.pin,
  // //   "PIN_DATA",
  // //   board
  // // );
  // if (![ARDUINO_PINS.PIN_A1, ARDUINO_PINS.PIN_A0].includes(state.pin)) {
  //   analogSensorEl.x(analogSensorEl.x() - 20);
  // }
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
  board,
  area
) => {
  const { holes, isDown } = area;

  createComponentWire(
    holes[2],
    isDown,
    componentEl,
    state.pin,
    draw,
    arduinoEl,
    id,
    "PIN_DATA",
    board
  );

  createGroundOrPowerWire(
    holes[3],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  createGroundOrPowerWire(
    holes[1],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "power"
  );
};

const createSoilSensorWires: CreateWire<AnalogSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;

  createComponentWire(
    holes[1],
    isDown,
    componentEl,
    state.pin,
    draw,
    arduinoEl,
    id,
    "PIN_DATA",
    board
  );

  createGroundOrPowerWire(
    holes[2],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  createGroundOrPowerWire(
    holes[3],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "power"
  );
};

const createPhotoSensorWires: CreateWire<AnalogSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;

  createComponentWire(
    holes[3],
    isDown,
    componentEl,
    state.pin,
    draw,
    arduinoEl,
    id,
    "PIN_DATA",
    board
  );

  createGroundOrPowerWire(
    holes[2],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  createGroundOrPowerWire(
    holes[1],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "power"
  );
};

export const createWireAnalogSensors: CreateWire<AnalogSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board,
  area
) => {
  return createWiresFunc[state.pictureType](
    state,
    draw,
    componentEl,
    arduinoEl,
    id,
    board,
    area
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
