import { SyncComponent, CreateComponent } from '../svg.component';
import {
  ArduinoComponentType,
  ArduinoComponentState,
} from '../../frames/arduino.frame';
import { LCDScreenState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
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
  if (state.type !== ArduinoComponentType.LCD_SCREEN) {
    return;
  }
  const lcdState = state as LCDScreenState;
  const id = componentToSvgId(lcdState);
  let lcdScreenEl = draw.findOne('#' + id) as Element;
  const arduino = draw.findOne('#arduino_main_svg') as Element;

  if (lcdScreenEl) {
    positionComponent(
      lcdScreenEl,
      arduino,
      draw,
      ARDUINO_UNO_PINS.PIN_12,
      'SCL_WIRE'
    );
    lcdScreenEl.y(lcdScreenEl.y() + 30);
    updateWires(lcdScreenEl, draw, arduino as Svg);

    return;
  }
  lcdScreenEl = draw.svg(getSvgString(lcdState)).last();
  lcdScreenEl.addClass('component');
  lcdScreenEl.attr('id', id);
  lcdScreenEl.size(lcdScreenEl.width() * 1.5, lcdScreenEl.height() * 1.5);
  (lcdScreenEl as Svg).viewbox(0, 0, lcdScreenEl.width(), lcdScreenEl.height());
  positionComponent(
    lcdScreenEl,
    arduino,
    draw,
    ARDUINO_UNO_PINS.PIN_12,
    'SCL_WIRE'
  );
  lcdScreenEl.y(lcdScreenEl.y() + 30);

  (window as any).lcd = lcdScreenEl;
  (lcdScreenEl as any).draggable().on('dragmove', (e) => {
    updateWires(lcdScreenEl, draw, arduino as Svg);
  });
  centerLetters(lcdScreenEl, lcdState);
  clearLetters(lcdScreenEl, lcdState);
  createWries(lcdScreenEl, ARDUINO_UNO_PINS.PIN_12, arduino as Svg, draw, id);
};

export const lcdUpdate: SyncComponent = (state, frame, draw) => {
  if (state.type !== ArduinoComponentType.LCD_SCREEN) {
    return;
  }
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
  createGroundWire(lcdEl, pin, arduino, draw, 'GND_BOX', componentId, 'left');

  createPowerWire(lcdEl, pin, arduino, draw, '_5V_BOX', componentId, 'left');

  createWire(
    lcdEl,
    ARDUINO_UNO_PINS.PIN_A4,
    'SDA_WIRE',
    arduino,
    draw,
    '#0071bc',
    'sda'
  );

  createWire(
    lcdEl,
    ARDUINO_UNO_PINS.PIN_A5,
    'SCL_WIRE',
    arduino,
    draw,
    '#f15a24',
    'scl'
  );
};
