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
  createResistor,
  createWireBreadboard,
  createWireFromArduinoToBreadBoard,
} from "../../core/virtual-circuit/wire";
import { Text } from "@svgdotjs/svg.js";

export const createRgbLed: AfterComponentCreateHook<LedColorState> = (
  state,
  rgbLedEl
) => {
  //todo consider labeling pin in picture
  (rgbLedEl.findOne("#RED_PIN_TEXT") as Text).text(`${state.redPin}`).cx(20.5);
  (rgbLedEl.findOne("#BLUE_PIN_TEXT") as Text)
    .text(`${state.bluePin}`)
    .cx(50.5);
  (rgbLedEl.findOne("#GREEN_PIN_TEXT") as Text)
    .text(`${state.greenPin}`)
    .cx(35.5);
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
  positionComponent(rgbLedEl, arduinoEl, draw, holes[1], isDown, "PIN_POWER");
  rgbLedEl.y(-73.5);
  rgbLedEl.data("disableDraggable", "TRUE");
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
  (rgbLedEl.findOne("#MAIN_COLOR") as Element).fill("#FFF");
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
  const { holes } = area;
  createWireFromArduinoToBreadBoard(
    state.redPin,
    arduino as Svg,
    draw,
    `pin${holes[0]}A`,
    id,
    board,
    "#FF0000"
  );

  createWireBreadboard(
    `pin${holes[0]}F`,
    `pin${holes[0]}E`,
    "#FF0000",
    draw,
    arduino as Svg,
    id
  );

  createWireFromArduinoToBreadBoard(
    state.greenPin,
    arduino as Svg,
    draw,
    `pin${holes[2]}A`,
    id,
    board,
    "#00FF00"
  );

  createWireBreadboard(
    `pin${holes[2]}F`,
    `pin${holes[2]}E`,
    "#00FF00",
    draw,
    arduino as Svg,
    id
  );

  createWireFromArduinoToBreadBoard(
    state.bluePin,
    arduino as Svg,
    draw,
    `pin${holes[4]}A`,
    id,
    board,
    "#0000FF"
  );

  createWireBreadboard(
    `pin${holes[4]}F`,
    `pin${holes[4]}E`,
    "#0000FF",
    draw,
    arduino as Svg,
    id
  );

  createWireBreadboard(
    `pin${holes[1]}D`,
    `pin${holes[0]}X`,
    "#000",
    draw,
    arduino as Svg,
    id
  );

  createResistor(arduino, draw, holes[1], true, id, "vertical", 1000);
};