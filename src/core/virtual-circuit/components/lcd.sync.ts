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

export const lcdCreate: CreateComponent = (state, frame, draw) => {
  if (state.type !== ArduinoComponentType.LCD_SCREEN) {
    return;
  }
  const lcdState = state as LCDScreenState;
  const id = componentToSvgId(lcdState);
  let lcdScreenEl = draw.findOne('#' + id) as Element;
  const arduino = draw.findOne('#arduino_main_svg') as Element;

  if (lcdScreenEl) {
    return;
  }
  lcdScreenEl = draw.svg(getSvgString(lcdState)).last();
  lcdScreenEl.addClass('component');
  lcdScreenEl.attr('id', id);
  (lcdScreenEl as Svg).viewbox(0, 0, lcdScreenEl.width(), lcdScreenEl.height());
  (window as any).lcd = lcdScreenEl;
  (lcdScreenEl as any).draggable().on('dragmove', (e) => {
    //updateWires(bluetoothEl, draw, arduino as Svg);
  });
  lcdScreenEl.size(lcdScreenEl.width() * 1.5, lcdScreenEl.height() * 1.5);
  centerLetters(lcdScreenEl, lcdState);
  //clearLetters(lcdScreenEl, lcdState);
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

export const lcdUpdate: SyncComponent = (state, frame, draw) => {
  if (state.type !== ArduinoComponentType.LCD_SCREEN) {
    return;
  }
};
