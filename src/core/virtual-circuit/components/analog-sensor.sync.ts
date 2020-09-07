import { SyncComponent, ResetComponent } from "../svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../svg-create";
import {
  PinState,
  PIN_TYPE,
  PinPicture,
} from "../../frames/arduino-components.state";
import { Element, Svg, Text } from "@svgdotjs/svg.js";
import { createWire, createGroundWire, createPowerWire } from "../wire";
import { positionComponent } from "../svg-position";
import _ from "lodash";

import { ARDUINO_UNO_PINS } from "../../microcontroller/selectBoard";

export const analogDigitalSensorCreate: CreateCompenentHook<PinState> = (
  state,
  analogSensorEl
) => {
  analogSensorEl.findOne("#PIN_TEXT").node.innerHTML = state.pin.toString();
  analogSensorEl.data("picture-type", state.pinPicture);
  if (pinCenterText[state.pinPicture]) {
    (analogSensorEl.findOne("#PIN_TEXT") as Element).cx(
      pinCenterText[state.pinPicture]
    );
  }
};

export const analogDigitalSensorPosition: PositionComponent<PinState> = (
  state,
  analogSensorEl,
  arduinoEl,
  draw
) => {
  positionComponent(analogSensorEl, arduinoEl, draw, state.pin, "PIN_DATA");
  if (![ARDUINO_UNO_PINS.PIN_A1, ARDUINO_UNO_PINS.PIN_A0].includes(state.pin)) {
    analogSensorEl.x(analogSensorEl.x() - 20);
  }
};

export const analogDigitalSensorUpdate: SyncComponent = (
  state: PinState,
  analogSensorEl,
  draw
) => {
  const textEl = analogSensorEl.findOne("#READING_VALUE") as Text;
  textEl.show();
  if (
    state.pinType === PIN_TYPE.DIGITAL_INPUT &&
    state.pinPicture === PinPicture.SENSOR
  ) {
    textEl.node.innerHTML = state.state === 1 ? "ON" : "OFF";
    textEl.cx(centerReadingText[state.pinPicture]);
    return;
  }

  if (state.pinPicture === PinPicture.TOUCH_SENSOR) {
    if (state.state === 1) {
      textEl.show();
      analogSensorEl.findOne("#finger").show();
    } else {
      textEl.hide();
      analogSensorEl.findOne("#finger").hide();
    }

    return;
  }

  textEl.node.innerHTML = state.state.toString();
  textEl.cx(centerReadingText[state.pinPicture]);
};

export const analogDigitalSensorReset: ResetComponent = (
  componentEl: Element
) => {
  componentEl.findOne("#READING_VALUE").hide();
  if (componentEl.findOne("#finger")) {
    componentEl.findOne("#finger").hide();
  }
};

const createSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    "PIN_DATA",
    arduinoEl,
    draw,
    "#228e0c",
    "data-pin"
  );
  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "right");
  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "left");
};

const createSoilSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    "PIN_DATA",
    arduinoEl,
    draw,
    "#228e0c",
    "data-pin"
  );

  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "right");
  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "right");
};

const createPhotoSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    "PIN_DATA",
    arduinoEl,
    draw,
    "#228e0c",
    "data-pin"
  );

  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "left");
  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "left");
};

const createTouchSensorWires: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  createWire(
    componentEl,
    state.pin,
    "PIN_DATA",
    arduinoEl,
    draw,
    "#228e0c",
    "data-pin"
  );

  createPowerWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "right");
  createGroundWire(componentEl, state.pin, arduinoEl as Svg, draw, id, "right");
};

export const createWireSensors: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  return createWiresFunc[state.pinPicture](
    state,
    draw,
    componentEl,
    arduinoEl,
    id
  );
};

const createWiresFunc = {
  [PinPicture.SOIL_SENSOR]: createSoilSensorWires,
  [PinPicture.SENSOR]: createSensorWires,
  [PinPicture.PHOTO_SENSOR]: createPhotoSensorWires,
  [PinPicture.TOUCH_SENSOR]: createTouchSensorWires,
};

const centerReadingText = {
  [PinPicture.SOIL_SENSOR]: 10,
  [PinPicture.SENSOR]: 18,
  [PinPicture.PHOTO_SENSOR]: 18,
  [PinPicture.TOUCH_SENSOR]: 10,
};

const pinCenterText = {
  [PinPicture.SENSOR]: 18,
  [PinPicture.TOUCH_SENSOR]: 10,
};
