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
} from "../../core/virtual-circuit/wire";

export const createRgbLed: AfterComponentCreateHook<LedColorState> = (
  state,
  rgbLedEl,
  arduinoEl,
  draw,
  board
) => {
  rgbLedEl.findOne("#RED_PIN_TEXT").node.innerHTML = state.redPin;
  rgbLedEl.findOne("#BLUE_PIN_TEXT").node.innerHTML = state.bluePin;
  rgbLedEl.findOne("#GREEN_PIN_TEXT").node.innerHTML = state.greenPin;
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
  positionComponent(rgbLedEl, arduinoEl, draw, holes[2], isDown, "PIN_GND");
};

export const updateRgbLed: SyncComponent = (state: LedColorState, rgbLedEl) => {
  let color = rgbToHex(state.color);
  if (color.toUpperCase() === "#000000") {
    (rgbLedEl.findOne("#MAIN_COLOR") as Element).hide();
    return;
  }
  (rgbLedEl.findOne("#MAIN_COLOR") as Element).show();
  (rgbLedEl.findOne("#MAIN_COLOR") as Element).fill(color);
};

export const resetRgbLed: ResetComponent = (rgbLedEl) => {
  (rgbLedEl.findOne("#MAIN_COLOR") as Element).hide();
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
    holes[3],
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
};
