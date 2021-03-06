import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import type { Element, Svg } from "@svgdotjs/svg.js";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type { LedColorState } from "./state";
import { rgbToHex } from "../../core/blockly/helpers/color.helper";
import {
  createComponentWire,
  createGroundOrPowerWire,
  createResistor,
} from "../../core/virtual-circuit/wire";

export const createRgbLed: AfterComponentCreateHook<LedColorState> = (
  state,
  rgbLedEl,
  arduinoEl,
  draw,
  board
) => {
  //todo consider labeling pin in picture

  rgbLedEl.data("picture-type", state.pictureType);

  rgbLedEl.findOne("#PIN_RED_TEXT").node.innerHTML = state.redPin;
  rgbLedEl.findOne("#PIN_BLUE_TEXT").node.innerHTML = state.bluePin;
  rgbLedEl.findOne("#PIN_GREEN_TEXT").node.innerHTML = state.greenPin;
};

export const positionRgbLed: PositionComponent<LedColorState> = (
  state,
  rgbLedEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(rgbLedEl, arduinoEl, draw, holes[2], isDown, "PIN_GREEN");
};

export const updateRgbLed: SyncComponent = (state: LedColorState, rgbLedEl) => {
  let color = rgbToHex(state.color);
  if (color.toUpperCase() === "#000000") {
    color = "#FFFFFF";
  }
  (rgbLedEl.findOne("#COLOR_LED") as Element).fill(color);
};

export const resetRgbLed: ResetComponent = (rgbLedEl) => {
  if (rgbLedEl.data("picture-type") === "BUILT_IN") {
    (rgbLedEl.findOne("#COLOR_LED circle") as Element).fill("#FFF");
    return;
  }

  (rgbLedEl.findOne("#COLOR_LED") as Element).fill("#FFF");
};

export const createWiresRgbLed: CreateWire<LedColorState> = (
  state,
  draw,
  rgbLedEl,
  arduino,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;

  const maxLength = holes.length - 1;
  createComponentWire(
    holes[0],
    isDown,
    rgbLedEl,
    state.redPin,
    draw,
    arduino,
    id,
    "PIN_RED",
    board
  );

  createComponentWire(
    holes[2],
    isDown,
    rgbLedEl,
    state.greenPin,
    draw,
    arduino,
    id,
    "PIN_GREEN",
    board
  );

  createComponentWire(
    holes[maxLength],
    isDown,
    rgbLedEl,
    state.bluePin,
    draw,
    arduino,
    id,
    "PIN_BLUE",
    board
  );

  createGroundOrPowerWire(
    holes[1],
    isDown,
    rgbLedEl,
    draw,
    arduino,
    id,
    "ground"
  );

  if (state.pictureType == "BREADBOARD") {
    createResistor(arduino, draw, holes[0], isDown, id, "vertical", 1000);
    createResistor(arduino, draw, holes[2], isDown, id, "vertical", 1000);
    createResistor(
      arduino,
      draw,
      holes[maxLength],
      isDown,
      id,
      "vertical",
      1000
    );
  }
};
