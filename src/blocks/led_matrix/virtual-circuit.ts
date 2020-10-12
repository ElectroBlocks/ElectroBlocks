import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../../core/virtual-circuit/svg-create";

import type { Element, Svg } from "@svgdotjs/svg.js";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  createPowerWire,
  createGroundWire,
  createWire,
} from "../../core/virtual-circuit/wire";
import type { LedMatrixState } from "./state";

export const ledMatrixPosition: PositionComponent<LedMatrixState> = (
  _,
  ledMatrixEl,
  arduinoEl,
  draw,
  board
) => {
  arduinoEl.y(draw.viewbox().y2 - arduinoEl.height() + 100);

  positionComponent(
    ledMatrixEl,
    arduinoEl,
    draw,
    ARDUINO_PINS.PIN_10,
    "PIN_DATA",
    board
  );
};

export const ledMatrixUpdate: SyncComponent = (
  state: LedMatrixState,
  ledMatrixEl
) => {
  state.leds.forEach((led) => {
    (ledMatrixEl.findOne(`#_${led.col}-${led.row} circle`) as Element).fill(
      led.isOn ? "#FF0000" : "#FFF"
    );
  });
};

export const ledMatrixCreate: CreateCompenentHook<LedMatrixState> = (
  state,
  ledMatrixEl
) => {
  ledMatrixEl.findOne("#PIN_CLK_TEXT").node.innerHTML = state.clkPin;
  ledMatrixEl.findOne("#PIN_CS_TEXT").node.innerHTML = state.csPin;
  ledMatrixEl.findOne("#PIN_DATA_TEXT").node.innerHTML = state.dataPin;
};

export const ledMatrixReset: ResetComponent = (componentEl: Element) => {
  for (let row = 1; row <= 8; row += 1) {
    for (let col = 1; col <= 8; col += 1) {
      (componentEl.findOne(`#_${col}-${row} circle`) as Element).fill("#FFF");
    }
  }
};

export const createWiresLedMatrix: CreateWire<LedMatrixState> = (
  state,
  draw,
  ledMatrixEl,
  arduino,
  id,
  board
) => {
  createGroundWire(
    ledMatrixEl,
    state.dataPin,
    arduino as Svg,
    draw,
    id,
    "right",
    board
  );
  createPowerWire(
    ledMatrixEl,
    state.dataPin,
    arduino as Svg,
    draw,
    id,
    "right",
    board
  );

  createWire(
    ledMatrixEl,
    state.dataPin,
    "PIN_DATA",
    arduino,
    draw,
    "#027a18",
    "data-pin",
    board
  );
  createWire(
    ledMatrixEl,
    state.csPin,
    "PIN_CS",
    arduino,
    draw,
    "#7b5fc9",
    "cs-pin",
    board
  );
  createWire(
    ledMatrixEl,
    state.clkPin,
    "PIN_CLK",
    arduino,
    draw,
    "#2130ff",
    "clk-pin",
    board
  );
};
