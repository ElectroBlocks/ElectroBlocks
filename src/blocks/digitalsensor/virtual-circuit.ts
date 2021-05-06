import type { Element, Svg, Text } from "@svgdotjs/svg.js";
import type {
  AfterComponentCreateHook,
  CreateWire,
  PositionComponent,
} from "../../core/virtual-circuit/svg-create";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type {
  ResetComponent,
  SyncComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";
import { DigitalPictureType, DigitalSensorState } from "./state";

export const createDigitalSensor: AfterComponentCreateHook<DigitalSensorState> = (
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
    (sensorEl.findOne("#SKIN_COLOR_CHANGE") as Element).node.style.fill =
      settings.touchSkinColor;
  }
};

export const positionDigitalSensor: PositionComponent<DigitalSensorState> = (
  state,
  sensorEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;

  if (state.pictureType === DigitalPictureType.TOUCH_SENSOR) {
    positionComponent(sensorEl, arduinoEl, draw, holes[2], isDown, "PIN_POWER");
    return;
  }

  positionComponent(sensorEl, arduinoEl, draw, holes[2], isDown, "PIN_DATA");
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
  if (state.pictureType === DigitalPictureType.SENSOR) {
    const sensingWave = analogSensorEl.findOne("#SENSING");
    if (state.isOn) {
      sensingWave.show();
    } else {
      sensingWave.hide();
    }
    return;
  }

  if (state.pictureType === DigitalPictureType.TOUCH_SENSOR) {
    if (state.isOn) {
      analogSensorEl.findOne("#finger").show();
    } else {
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
  board,
  area
) => {
  return state.pictureType === DigitalPictureType.SENSOR
    ? createSensorWires(state, draw, componentEl, arduinoEl, id, board, area)
    : createTouchSensorWires(
        state,
        draw,
        componentEl,
        arduinoEl,
        id,
        board,
        area
      );
};

const createSensorWires: CreateWire<DigitalSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
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
    arduinoEl,
    id,
    "power"
  );

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

  // createWire(
  //   componentEl,
  //   state.pin,
  //   "PIN_DATA",
  //   arduinoEl,
  //   draw,
  //   "#228e0c",
  //   "data-pin",
  //   board
  // );
  // createGroundWire(
  //   componentEl,
  //   state.pin,
  //   arduinoEl as Svg,
  //   draw,
  //   id,
  //   "right",
  //   board
  // );
  // createPowerWire(
  //   componentEl,
  //   state.pin,
  //   arduinoEl as Svg,
  //   draw,
  //   id,
  //   "left",
  //   board
  // );
};

const createTouchSensorWires: CreateWire<DigitalSensorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;
  createGroundOrPowerWire(
    holes[1],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "power"
  );

  createComponentWire(
    holes[0],
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
};

const pinCenterText = {
  [DigitalPictureType.SENSOR]: 18,
  [DigitalPictureType.TOUCH_SENSOR]: 10,
};
