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
  createWireBreadboard,
  createWireComponentToBreadboard,
  createWireFromArduinoToBreadBoard,
} from "../../core/virtual-circuit/wire";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  Breadboard,
  MicroController,
} from "../../core/microcontroller/microcontroller";

export const createRgbLed: AfterComponentCreateHook<LedColorState> = (
  state,
  rgbLedEl,
  arduinoEl,
  draw,
  board
) => {
  //todo consider labeling pin in picture

  rgbLedEl.data("picture-type", "BUILT_IN");

  rgbLedEl.findOne("#PIN_RED").node.innerHTML = state.redPin;
  rgbLedEl.findOne("#PIN_BLUE").node.innerHTML = state.bluePin;
  rgbLedEl.findOne("#PIN_GREEN").node.innerHTML = state.greenPin;
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
    color = "#FFFFFF";
  }
  (rgbLedEl.findOne("#COLOR_LED_RED") as Element).fill(color);
};

export const resetRgbLed: ResetComponent = (rgbLedEl) => {
  if (rgbLedEl.data("picture-type") === "BUILT_IN") {
    (rgbLedEl.findOne("COLOR_LED_RED") as Element).fill("#FFF");
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

const createResistorRequiredWire = (
  color: string,
  pin: ARDUINO_PINS,
  hole: number,
  connectionId: string,
  arduino: Svg,
  draw: Svg,
  rgbLedEl: Element,
  componentId: string,
  board: MicroController
) => {
  createWireComponentToBreadboard(
    `pin${hole}H`,
    rgbLedEl,
    draw,
    arduino,
    connectionId,
    componentId,
    color
  );

  createWireFromArduinoToBreadBoard(
    pin,
    arduino as Svg,
    draw,
    `pin${hole}A`,
    componentId,
    board
  );
};

const createGroundWireForBreadboard = (
  hole: number,
  connectionId: string,
  arduino: Svg,
  draw: Svg,
  rgbLedEl: Element,
  componentId: string
) => {
  createWireComponentToBreadboard(
    `pin${hole}H`,
    rgbLedEl,
    draw,
    arduino,
    connectionId,
    componentId,
    "#000"
  );

  createWireBreadboard(
    `pin${hole}F`,
    `pin${hole + 1}X`,
    "#000",
    draw,
    arduino as Svg,
    componentId
  );
};
