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
  if (state.numberOfComponents == 2) {
    rgbLedEl.findOne("#RED_PIN_TEXT_2").node.innerHTML = state.redPin2;
    rgbLedEl.findOne("#BLUE_PIN_TEXT_2").node.innerHTML = state.bluePin2;
    rgbLedEl.findOne("#GREEN_PIN_TEXT_2").node.innerHTML = state.greenPin2;
  }

  rgbLedEl.findOne("#RED_PIN_TEXT_1").node.innerHTML = state.redPin1;
  rgbLedEl.findOne("#BLUE_PIN_TEXT_1").node.innerHTML = state.bluePin1;
  rgbLedEl.findOne("#GREEN_PIN_TEXT_1").node.innerHTML = state.greenPin1;

  if (state.numberOfComponents == 1) {
    rgbLedEl.findOne("#LED_2").hide();
  } else {
    rgbLedEl.findOne("#LED_2").show();
  }
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
  positionComponent(rgbLedEl, arduinoEl, draw, holes[2], isDown, "PIN_BLUE_1");
};

export const updateRgbLed: SyncComponent = (state: LedColorState, rgbLedEl) => {
  let color = rgbToHex(state.color);
  setColor(state, rgbLedEl, color, 1);
  if (state.numberOfComponents == 2) {
    let color2 = rgbToHex(state.color2);
    setColor(state, rgbLedEl, color2, 2);
  }
};

function setColor(
  state: LedColorState,
  rgbLedEl,
  color: string,
  ledNum: number
) {
  if (color.toUpperCase() === "#000000") {
    (rgbLedEl.findOne(`#MAIN_COLOR_${ledNum}`) as Element).hide();
    return;
  }
  (rgbLedEl.findOne(`#MAIN_COLOR_${ledNum}`) as Element).show();
  (rgbLedEl.findOne(`#MAIN_COLOR_${ledNum}`) as Element).fill(color);
}

export const resetRgbLed: ResetComponent = (rgbLedEl) => {
  (rgbLedEl.findOne("#MAIN_COLOR_1") as Element).hide();
  (rgbLedEl.findOne("#MAIN_COLOR_2") as Element).hide();
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
  if (state.numberOfComponents == 2) {
    createComponentWire(
      holes[0],
      isDown,
      rgbLedEl,
      state.redPin1,
      draw,
      arduino,
      id,
      "PIN_RED_2",
      board
    );
    createComponentWire(
      holes[2],
      isDown,
      rgbLedEl,
      state.greenPin1,
      draw,
      arduino,
      id,
      "PIN_GREEN_2",
      board
    );

    createComponentWire(
      holes[3],
      isDown,
      rgbLedEl,
      state.bluePin1,
      draw,
      arduino,
      id,
      "PIN_BLUE_2",
      board
    );
    createGroundOrPowerWire(
      holes[1],
      isDown,
      rgbLedEl,
      draw,
      arduino,
      id,
      "ground",
      "PIN_GND_2"
    );
  }
  createComponentWire(
    holes[0],
    isDown,
    rgbLedEl,
    state.redPin1,
    draw,
    arduino,
    id,
    "PIN_RED_1",
    board
  );
  createComponentWire(
    holes[2],
    isDown,
    rgbLedEl,
    state.greenPin1,
    draw,
    arduino,
    id,
    "PIN_GREEN_1",
    board
  );

  createComponentWire(
    holes[3],
    isDown,
    rgbLedEl,
    state.bluePin1,
    draw,
    arduino,
    id,
    "PIN_BLUE_1",
    board
  );
  createGroundOrPowerWire(
    holes[1],
    isDown,
    rgbLedEl,
    draw,
    arduino,
    id,
    "ground",
    "PIN_GND_1"
  );
};
