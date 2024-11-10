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
    color = "#FFFFFF";
  }
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
  const { holes, isDown } = area;

  createResistorRequiredWire(
    board.pinConnections[state.redPin].color,
    state.redPin,
    holes[0],
    "PIN_RED",
    arduino as Svg,
    draw,
    rgbLedEl,
    id,
    board
  );

  createResistorRequiredWire(
    board.pinConnections[state.greenPin].color,
    state.greenPin,
    holes[2],
    "PIN_GREEN",
    arduino as Svg,
    draw,
    rgbLedEl,
    id,
    board
  );

  createResistorRequiredWire(
    board.pinConnections[state.bluePin].color,
    state.bluePin,
    holes[3],
    "PIN_BLUE",
    arduino as Svg,
    draw,
    rgbLedEl,
    id,
    board
  );

  createGroundWireForBreadboard(
    holes[1],
    "PIN_GND",
    arduino as Svg,
    draw,
    rgbLedEl,
    id
  );
  createResistor(arduino, draw, holes[0], true, id, "vertical", 1000);
  createResistor(arduino, draw, holes[2], true, id, "vertical", 1000);
  createResistor(arduino, draw, holes[3], true, id, "vertical", 1000);
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