import type {
  SyncComponent,
  ResetComponent,
} from '../../core/virtual-circuit/svg-sync';
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from '../../core/virtual-circuit/svg-create';

import type { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../../core/virtual-circuit/svg-position';
import type { LedMatrixState } from './state';
import {
  createComponentWire,
  createGroundOrPowerWire,
} from '../../core/virtual-circuit/wire';

export const ledMatrixPosition: PositionComponent<LedMatrixState> = (
  _,
  ledMatrixEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(ledMatrixEl, arduinoEl, draw, holes[2], isDown, 'PIN_DATA');
};

export const ledMatrixUpdate: SyncComponent = (
  state: LedMatrixState,
  ledMatrixEl
) => {
  state.leds.forEach((led) => {
    (ledMatrixEl.findOne(`#_${led.row}-${led.col} circle`) as Element).fill(
      led.isOn ? '#FF0000' : '#FFF'
    );
  });
};

export const ledMatrixCreate: AfterComponentCreateHook<LedMatrixState> = (
  state,
  ledMatrixEl
) => {
  ledMatrixEl.findOne('#PIN_CLK_TEXT').node.innerHTML = state.clkPin;
  ledMatrixEl.findOne('#PIN_CS_TEXT').node.innerHTML = state.csPin;
  ledMatrixEl.findOne('#PIN_DATA_TEXT').node.innerHTML = state.dataPin;
};

export const ledMatrixReset: ResetComponent = (componentEl: Element) => {
  for (let row = 1; row <= 8; row += 1) {
    for (let col = 1; col <= 8; col += 1) {
      (componentEl.findOne(`#_${row}-${col} circle`) as Element).fill('#FFF');
    }
  }
};

export const createWiresLedMatrix: CreateWire<LedMatrixState> = (
  state,
  draw,
  ledMatrixEl,
  arduino,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;

  if (holes.length <= 4) {
    return;
  }

  createComponentWire(
    holes[0],
    isDown,
    ledMatrixEl,
    state.clkPin,
    draw,
    arduino,
    id,
    'PIN_CLK',

    board
  );

  createComponentWire(
    holes[1],
    isDown,
    ledMatrixEl,
    state.csPin,
    draw,
    arduino,
    id,
    'PIN_CS',

    board
  );

  createComponentWire(
    holes[2],
    isDown,
    ledMatrixEl,
    state.dataPin,
    draw,
    arduino,
    id,
    'PIN_DATA',

    board
  );

  createGroundOrPowerWire(
    holes[3],
    isDown,
    ledMatrixEl,
    draw,
    arduino,
    id,
    'ground'
  );

  createGroundOrPowerWire(
    holes[4],
    isDown,
    ledMatrixEl,
    draw,
    arduino,
    id,
    'power'
  );
};
