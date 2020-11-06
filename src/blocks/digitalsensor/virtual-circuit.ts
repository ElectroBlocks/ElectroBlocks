import type { Element, Svg, Text } from "@svgdotjs/svg.js";
import type {
  CreateCompenentHook,
  CreateWire,
  PositionComponent,
} from "../../core/virtual-circuit/svg-create";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type {
  ResetComponent,
  SyncComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  createGroundWire,
  createPowerWire,
  createWire,
} from "../../core/virtual-circuit/wire";
import { DigitalPictureType, DigitalSensorState } from "./state";

export const createDigitalSensor: CreateCompenentHook<DigitalSensorState> = (
  state,
  sensorEl,
  arduinoEl,
  draw,
  micro,
  settings
) => {
  sensorEl.findOne("#PIN_TEXT").node.innerHTML = state.pin.toString();
  sensorEl.data("picture-type", state.pictureType);
  if (pinCenterText[state.pictureType]) {
    (sensorEl.findOne("#PIN_TEXT") as Element).cx(
      pinCenterText[state.pictureType]
    );
  }

  if (state.pictureType === DigitalPictureType.TOUCH_SENSOR) {
    (sensorEl.findOne("#SKIN_COLOR_CHANGE") as Element).node.style.fill = settings.touchSkinColor;
  }
};

export const positionDigitalSensor: PositionComponent<DigitalSensorState> = (
  state,
  sensorEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(sensorEl, arduinoEl, draw, state.pin, "PIN_DATA", board);
};

export const resetDigitalSensor: ResetComponent = (componentEl: Element) => {
  componentEl.findOne("#READING_VALUE").hide();
  if (componentEl.findOne("#finger")) {
    componentEl.findOne("#finger").hide();
  }
};

export const updateDigitalSensor: SyncComponent = (
  state: DigitalSensorState,
  analogSensorEl,
  draw
) => {
  const textEl = analogSensorEl.findOne("#READING_VALUE") as Text;
  textEl.show();
  if (state.pictureType === DigitalPictureType.SENSOR) {
    textEl.node.innerHTML = state.isOn ? "ON" : "OFF";
    textEl.cx(18);
    return;
  }

  if (state.pictureType === DigitalPictureType.TOUCH_SENSOR) {
    if (state.isOn) {
      textEl.show();
      analogSensorEl.findOne("#finger").show();
    } else {
      textEl.hide();
      analogSensorEl.findOne("#finger").hide();
    }

    return;
  }
};

export const createWireDigitalSensor: CreateWire<DigitalSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board
) => {
  return state.pictureType === DigitalPictureType.SENSOR
    ? createSensorWires(state, draw, componentEl, arduinoEl, id, board)
    : createTouchSensorWires(state, draw, componentEl, arduinoEl, id, board);
};

const createSensorWires: CreateWire<DigitalSensorState> = (
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

const createTouchSensorWires: CreateWire<DigitalSensorState> = (
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

  createPowerWire(
    componentEl,
    state.pin,
    arduinoEl as Svg,
    draw,
    id,
    "right",
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
};

const pinCenterText = {
  [DigitalPictureType.SENSOR]: 18,
  [DigitalPictureType.TOUCH_SENSOR]: 10,
};
