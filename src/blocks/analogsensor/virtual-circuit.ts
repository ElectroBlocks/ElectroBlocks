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
import _ from "lodash";

import { AnalogSensorPicture, type AnalogSensorState } from "./state";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";
import { colorBrightnessAdjuster } from "../../core/virtual-circuit/svg-helpers";

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
  const { holes, isDown } = area;
  if (state.pictureType === AnalogSensorPicture.SENSOR) {
    positionComponent(
      analogSensorEl,
      arduinoEl,
      draw,
      holes[3],
      isDown,
      "PIN_DATA"
    );
  } else {
    positionComponent(
      analogSensorEl,
      arduinoEl,
      draw,
      holes[3],
      isDown,
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
  analogSensorEl
) => {
  const textEl = analogSensorEl.findOne("#READING_VALUE") as Text;
  textEl.show();

  textEl.node.innerHTML = state.state.toString();

  updateSensorList[state.pictureType](state, analogSensorEl);
};

export const analogSensorReset: ResetComponent = (componentEl: Element) => {
  componentEl.findOne("#READING_VALUE").hide();
  if (componentEl.findOne("#finger")) {
    componentEl.findOne("#finger").hide();
  }
};

const createPotentiometerWires: CreateWire<AnalogSensorState> = (
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
    holes[1],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  createGroundOrPowerWire(
    holes[2],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "power"
  );
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

const updatePhotoSensor = (
  state: AnalogSensorState,
  analogSensorEl: Element
) => {
  const percent = state.state / 1024;
  const sunColor = analogSensorEl.findOne("#SUN_COLOR") as Element;
  sunColor.children().forEach((c) => c.opacity(percent));

  const textEl = analogSensorEl.findOne("#READING_VALUE") as Text;
  textEl.cx(25);
};

const updateSoilSensor = (
  state: AnalogSensorState,
  analogSensorEl: Element
) => {
  const textEl = analogSensorEl.findOne("#READING_VALUE") as Text;
  textEl.cx(27);
  const percentToLighten = (1024 - state.state) / 1024;
  const color = colorBrightnessAdjuster("#684404", percentToLighten);
  (analogSensorEl.findOne("#POT") as Element).fill(color);
};

const updatePotentiometerSensor = (
  state: AnalogSensorState,
  sensor: Element
) => {
  const textEl = sensor.findOne("#READING_VALUE") as Text;
  textEl.cx(43);
  const rotateEl = sensor.findOne("#ROTATE_KNOB") as Svg;
  const lastDegree = +sensor.data("degree") ?? 0;
  const degree = (state.state / 1024) * 180;
  rotateEl.rotate(lastDegree, rotateEl.cx(), rotateEl.cy());
  rotateEl.rotate(degree * -1, rotateEl.cx(), rotateEl.cy());
  sensor.data("degree", degree);
};

const updateGenericSensor = (
  state: AnalogSensorState,
  analogSensorEl: Element
) => {
  const textEl = analogSensorEl.findOne("#READING_VALUE") as Text;

  textEl.cx(40);
};

const createWiresFunc = {
  [AnalogSensorPicture.SOIL_SENSOR]: createSoilSensorWires,
  [AnalogSensorPicture.SENSOR]: createSensorWires,
  [AnalogSensorPicture.PHOTO_SENSOR]: createPhotoSensorWires,
  [AnalogSensorPicture.POTENTIOMETER]: createPotentiometerWires,
};

const updateSensorList = {
  [AnalogSensorPicture.SOIL_SENSOR]: updateSoilSensor,
  [AnalogSensorPicture.SENSOR]: updateGenericSensor,
  [AnalogSensorPicture.PHOTO_SENSOR]: updatePhotoSensor,
  [AnalogSensorPicture.POTENTIOMETER]: updatePotentiometerSensor,
};
