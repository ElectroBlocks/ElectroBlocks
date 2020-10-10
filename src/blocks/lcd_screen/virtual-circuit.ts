import {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../../core/virtual-circuit/svg-create";

import { LCDScreenState } from "./state";
import { Element, Svg, Text } from "@svgdotjs/svg.js";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  createGroundWire,
  createPowerWire,
  createWire,
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

export const lcdCreate: CreateCompenentHook<LCDScreenState> = (
  state,
  lcdScreenEl
) => {
  centerLetters(lcdScreenEl, state);
  lcdScreenEl.findOne("#PIN_SCL_TEXT").node.innerHTML = state.sclPin;
  lcdScreenEl.findOne("#PIN_SDA_TEXT").node.innerHTML = state.sdaPin;
};

export const lcdPosition: PositionComponent<LCDScreenState> = (
  _,
  lcdScreenEl,
  arduino,
  draw,
  board
) => {
  positionComponent(
    lcdScreenEl,
    arduino,
    draw,
    ARDUINO_PINS.PIN_12,
    "PIN_SCL",
    board
  );

  lcdScreenEl.y(lcdScreenEl.y() - 30);
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
  lcdScreenEl,
  draw
) => {
  for (let row = 1; row <= state.rows; row += 1) {
    for (let col = 1; col <= state.columns; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;
      (letterEl as Text).node.innerHTML = state.rowsOfText[row - 1][col - 1];
      letterEl.cx(state.rows === 4 ? 12 : 22); // 4 by 20 the squares are smaller
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
};

const centerLetters = (lcdScreenEl: Element, lcdState: LCDScreenState) => {
  for (let row = 1; row <= lcdState.rows; row += 1) {
    for (let col = 1; col <= lcdState.columns; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;
      letterEl.cx(lcdState.rows === 4 ? 12 : 22); // 4 by 20 the squares are smaller
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
  board
) => {
  createGroundWire(
    lcdEl,
    state.sdaPin,
    arduino as Svg,
    draw,
    id,
    "left",
    board
  );

  createPowerWire(lcdEl, state.sdaPin, arduino as Svg, draw, id, "left", board);

  createWire(
    lcdEl,
    state.sdaPin,
    "PIN_SDA",
    arduino,
    draw,
    "#0071bc",
    "sda",
    board
  );

  createWire(
    lcdEl,
    state.sclPin,
    "PIN_SCL",
    arduino,
    draw,
    "#f15a24",
    "scl",
    board
  );
};
