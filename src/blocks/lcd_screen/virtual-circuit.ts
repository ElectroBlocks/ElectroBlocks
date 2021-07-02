import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import type { LCDScreenState } from "./state";
import type { Element, Svg, Text } from "@svgdotjs/svg.js";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";

/**
 * Timer for blinking
 */
let blinkingTimer;

/**
 * Blink Position
 */
let blinkPosition = { row: 0, col: 0 };

/**
 * If true it will go dark
 */
let isDarkBlinking = false;

export const lcdCreate: AfterComponentCreateHook<LCDScreenState> = (
  state,
  lcdScreenEl
) => {
  centerLetters(lcdScreenEl, state);
  lcdScreenEl.findOne("#PIN_SCL_TEXT").node.innerHTML = state.sclPin;
  lcdScreenEl.findOne("#PIN_SDA_TEXT").node.innerHTML = state.sdaPin;
};

export const lcdPosition: PositionComponent<LCDScreenState> = (
  state,
  lcdScreenEl,
  arduino,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(lcdScreenEl, arduino, draw, holes[1], isDown, "PIN_POWER");
};

export const lcdReset: ResetComponent = (lcdScreenEl: Element) => {
  for (let row = 1; row <= 4; row += 1) {
    for (let col = 1; col <= 20; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;
      if (letterEl) {
        (letterEl as Text).text("");
      }
    }
  }
  clearInterval(blinkingTimer);
};

export const lcdUpdate: SyncComponent = (
  state: LCDScreenState,
  lcdScreenEl
) => {
  for (let row = 1; row <= state.rows; row += 1) {
    for (let col = 1; col <= state.columns; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;

      (letterEl as Text).node.innerHTML = state.rowsOfText[row - 1][col - 1];
    }
  }
  if (!state.blink.blinking) {
    const space = lcdScreenEl.findOne(
      `#space-${blinkPosition.col}-${blinkPosition.row} rect`
    ) as Element;

    if (space) {
      space.fill("#fff");
    }
    blinkPosition.row = 0;
    blinkPosition.col = 0;
    isDarkBlinking = false;
    clearInterval(blinkingTimer);
  }

  if (state.blink.blinking) {
    const { row, column } = state.blink;
    if (blinkPosition.row !== row || blinkPosition.col !== column) {
      clearInterval(blinkingTimer);
      blinkPosition.row = row;
      blinkPosition.col = column;
      const space = lcdScreenEl.findOne(
        `#space-${blinkPosition.col}-${blinkPosition.row} rect`
      ) as Element;
      if (space) {
        blinkingTimer = setInterval(() => {
          space.fill(isDarkBlinking ? "#292827" : "#fff");
          isDarkBlinking = !isDarkBlinking;
        }, 500);
      }
    }
  }

  toggleDarkLightScreen(lcdScreenEl, state);
  centerLetters(lcdScreenEl, state);
};

const centerLetters = (lcdScreenEl: Element, lcdState: LCDScreenState) => {
  for (let row = 1; row <= lcdState.rows; row += 1) {
    for (let col = 1; col <= lcdState.columns; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;
      const spaceEl = lcdScreenEl.findOne(`#space-${col}-${row}`) as Element;
      letterEl.cx(lcdState.rows === 2 ? 5 : 12);
      letterEl.attr("y", "-2");
    }
  }
};

const toggleDarkLightScreen = (
  lcdScreenEl: Element,
  lcdState: LCDScreenState
) => {
  for (let row = 1; row <= lcdState.rows; row += 1) {
    for (let col = 1; col <= lcdState.columns; col += 1) {
      (lcdScreenEl.findOne(`#space-${col}-${row} rect`) as Element).fill(
        lcdState.backLightOn ? "#fff" : "#292827"
      );
    }
  }
};

export const createWiresLcd: CreateWire<LCDScreenState> = (
  state,
  draw,
  lcdEl,
  arduino,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;
  createGroundOrPowerWire(holes[1], isDown, lcdEl, draw, arduino, id, "power");
  createGroundOrPowerWire(holes[0], isDown, lcdEl, draw, arduino, id, "ground");

  createComponentWire(
    holes[3],
    isDown,
    lcdEl,
    state.sdaPin,
    draw,
    arduino as Svg,
    id,
    "PIN_SDA",
    board
  );

  createComponentWire(
    holes[2],
    isDown,
    lcdEl,
    state.sclPin,
    draw,
    arduino as Svg,
    id,
    "PIN_SCL",
    board
  );
};
