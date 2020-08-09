import {
  SyncComponent,
  CreateComponent,
  ResetComponent,
} from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { LCDScreenState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import lcd_16_2_svg from '../svgs/lcd/lcd_16_2.svg';
import lcd_20_4_svg from '../svgs/lcd/lcd_20_4.svg';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import {
  createGroundWire,
  createPowerWire,
  createWire,
  updateWires,
} from '../wire';
import { addDraggableEvent } from '../component-events.helpers';

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

export const lcdCreate: CreateComponent = (state, frame, draw) => {
  const lcdState = state as LCDScreenState;
  const id = componentToSvgId(lcdState);
  let lcdScreenEl = draw.findOne('#' + id) as Element;
  const arduino = findArduinoEl(draw);

  if (lcdScreenEl) {
    return;
  }
  lcdScreenEl = createComponentEl(draw, lcdState, getSvgString(lcdState));

  arduino.y(draw.viewbox().y2 - arduino.height() + 70);

  positionComponent(
    lcdScreenEl,
    arduino,
    draw,
    ARDUINO_UNO_PINS.PIN_12,
    'PIN_SCL'
  );

  lcdScreenEl.y(lcdScreenEl.y() - 30);

  addDraggableEvent(lcdScreenEl, arduino, draw);
  createWries(lcdScreenEl, ARDUINO_UNO_PINS.PIN_12, arduino as Svg, draw, id);
  centerLetters(lcdScreenEl, lcdState);
  clearLetters(lcdScreenEl, lcdState);

  (window as any).lcd = lcdScreenEl;
};

export const lcdReset: ResetComponent = (lcdScreenEl: Element) => {
  for (let row = 1; row <= 4; row += 1) {
    for (let col = 1; col <= 20; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;
      if (letterEl) {
        (letterEl as Text).text('');
      }
    }
  }
  clearInterval(blinkingTimer);
};

export const lcdUpdate: SyncComponent = (state, frame, draw) => {
  const lcdState = state as LCDScreenState;
  const id = componentToSvgId(lcdState);
  let lcdScreenEl = draw.findOne('#' + id) as Element;
  if (!lcdScreenEl) {
    console.error('No LCD Screen Element');
    return;
  }
  for (let row = 1; row <= lcdState.rows; row += 1) {
    for (let col = 1; col <= lcdState.columns; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;
      (letterEl as Text).node.innerHTML = lcdState.rowsOfText[row - 1][col - 1];
      letterEl.cx(lcdState.rows === 4 ? 10 : 14); // 4 by 20 the squares are smaller
    }
  }
  if (!lcdState.blink.blinking) {
    const space = lcdScreenEl.findOne(
      `#space-${blinkPosition.col}-${blinkPosition.row} rect`
    ) as Element;

    if (space) {
      space.fill('#fff');
    }
    blinkPosition.row = 0;
    blinkPosition.col = 0;
    isDarkBlinking = false;
    clearInterval(blinkingTimer);
  }

  if (lcdState.blink.blinking) {
    const { row, column } = lcdState.blink;
    if (blinkPosition.row !== row || blinkPosition.col !== column) {
      clearInterval(blinkingTimer);
      blinkPosition.row = row;
      blinkPosition.col = column;
      const space = lcdScreenEl.findOne(
        `#space-${blinkPosition.col}-${blinkPosition.row} rect`
      ) as Element;
      if (space) {
        blinkingTimer = setInterval(() => {
          space.fill(isDarkBlinking ? '#292827' : '#fff');
          isDarkBlinking = !isDarkBlinking;
        }, 500);
      }
    }
  }

  toggleDarkLightScreen(lcdScreenEl, lcdState);
};

const centerLetters = (lcdScreenEl: Element, lcdState: LCDScreenState) => {
  for (let row = 1; row <= lcdState.rows; row += 1) {
    for (let col = 1; col <= lcdState.columns; col += 1) {
      const letterEl = lcdScreenEl.findOne(`#letter-${col}-${row}`) as Element;
      letterEl.cx(lcdState.rows === 4 ? 10 : 14); // 4 by 20 the squares are smaller
    }
  }
};

const clearLetters = (lcdScreenEl: Element, lcdState: LCDScreenState) => {
  for (let row = 1; row <= lcdState.rows; row += 1) {
    for (let col = 1; col <= lcdState.columns; col += 1) {
      (lcdScreenEl.findOne(`#letter-${col}-${row}`) as Text).text('');
    }
  }
};

const getSvgString = (state: LCDScreenState) => {
  if (state.rows === 4) {
    return lcd_20_4_svg;
  }

  return lcd_16_2_svg;
};

const toggleDarkLightScreen = (
  lcdScreenEl: Element,
  lcdState: LCDScreenState
) => {
  for (let row = 1; row <= lcdState.rows; row += 1) {
    for (let col = 1; col <= lcdState.columns; col += 1) {
      (lcdScreenEl.findOne(`#space-${col}-${row} rect`) as Element).fill(
        lcdState.backLightOn ? '#fff' : '#292827'
      );
    }
  }
};

const createWries = (
  lcdEl: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string
) => {
  createGroundWire(lcdEl, pin, arduino, draw, componentId, 'left');

  createPowerWire(lcdEl, pin, arduino, draw, componentId, 'left');

  createWire(
    lcdEl,
    ARDUINO_UNO_PINS.PIN_A4,
    'PIN_SDA',
    arduino,
    draw,
    '#0071bc',
    'sda'
  );

  createWire(
    lcdEl,
    ARDUINO_UNO_PINS.PIN_A5,
    'PIN_SCL',
    arduino,
    draw,
    '#f15a24',
    'scl'
  );
};
