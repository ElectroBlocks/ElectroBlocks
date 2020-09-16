import { SyncComponent, ResetComponent } from "../svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../svg-create";

import { LedMatrixState } from "../../frames/arduino-components.state";
import { Element, Svg } from "@svgdotjs/svg.js";

import { positionComponent } from "../svg-position";
import { ARDUINO_PINS } from "../../microcontroller/selectBoard";
import { createPowerWire, createGroundWire, createWire } from "../wire";

export const ledMatrixPosition: PositionComponent<LedMatrixState> = (
  _,
  ledMatrixEl,
  arduinoEl,
  draw
) => {
  arduinoEl.y(draw.viewbox().y2 - arduinoEl.height() + 100);

  positionComponent(
    ledMatrixEl,
    arduinoEl,
    draw,
    ARDUINO_PINS.PIN_10,
    "PIN_DATA"
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
  id
) => {
  createGroundWire(
    ledMatrixEl,
    state.dataPin,
    arduino as Svg,
    draw,
    id,
    "right"
  );
  createPowerWire(
    ledMatrixEl,
    state.dataPin,
    arduino as Svg,
    draw,
    id,
    "right"
  );

  createWire(
    ledMatrixEl,
    state.dataPin,
    "PIN_DATA",
    arduino,
    draw,
    "#027a18",
    "data-pin"
  );
  createWire(
    ledMatrixEl,
    state.csPin,
    "PIN_CS",
    arduino,
    draw,
    "#7b5fc9",
    "cs-pin"
  );
  createWire(
    ledMatrixEl,
    state.clkPin,
    "PIN_CLK",
    arduino,
    draw,
    "#2130ff",
    "clk-pin"
  );
};
