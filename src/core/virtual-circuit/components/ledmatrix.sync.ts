import {
  CreateComponent,
  SyncComponent,
  ResetComponent,
} from '../svg.component';
import { LedMatrixState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';

import ledmatrixSvgString from '../svgs/ledmatrix/ledmatrix.svg';
import { positionComponent } from '../svg-position';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { addDraggableEvent } from '../component-events.helpers';
import { createPowerWire, createGroundWire, createWire } from '../wire';

export const ledMatrixCreate: CreateComponent = (state, frame, draw) => {
  const ledMatrixState = state as LedMatrixState;

  const id = componentToSvgId(ledMatrixState);
  let ledMatrixEl = draw.findOne('#' + id) as Element;
  const arduino = findArduinoEl(draw);

  if (ledMatrixEl) {
    ledMatrixReset(ledMatrixEl);
    return;
  }

  ledMatrixEl = createComponentEl(draw, state, ledmatrixSvgString);
  (window as any).ledMatrixEl = ledMatrixEl;
  positionComponent(
    ledMatrixEl,
    arduino,
    draw,
    ARDUINO_UNO_PINS.PIN_10,
    'DATA_PIN'
  );
  createWires(ledMatrixEl, arduino as Svg, draw, id);
  addDraggableEvent(ledMatrixEl, arduino, draw);
};

export const ledMatrixUpdate: SyncComponent = (state, frame, draw) => {
  const ledMatrixState = state as LedMatrixState;

  const id = componentToSvgId(ledMatrixState);
  let ledMatrixEl = draw.findOne('#' + id) as Element;

  ledMatrixState.leds.forEach((led) => {
    (ledMatrixEl.findOne(`#_${led.col}-${led.row} circle`) as Element).fill(
      led.isOn ? '#FF0000' : '#FFF'
    );
  });
};

export const ledMatrixReset: ResetComponent = (componentEl: Element) => {
  for (let row = 1; row <= 8; row += 1) {
    for (let col = 1; col <= 8; col += 1) {
      (componentEl.findOne(`#_${col}-${row} circle`) as Element).fill('#FFF');
    }
  }
};

const createWires = (
  ledMatrixEl: Element,
  arduino: Svg,
  draw: Svg,
  componentId: string
) => {
  createPowerWire(
    ledMatrixEl,
    ARDUINO_UNO_PINS.PIN_9,
    arduino,
    draw,
    'VCC_PIN',
    componentId,
    'left'
  );

  createGroundWire(
    ledMatrixEl,
    ARDUINO_UNO_PINS.PIN_9,
    arduino,
    draw,
    'GND_PIN',
    componentId,
    'left'
  );

  createWire(
    ledMatrixEl,
    ARDUINO_UNO_PINS.PIN_12,
    'DATA_PIN',
    arduino,
    draw,
    '#027a18',
    'data-pin'
  );
  createWire(
    ledMatrixEl,
    ARDUINO_UNO_PINS.PIN_10,
    'CS_PIN',
    arduino,
    draw,
    '#7b5fc9',
    'cs-pin'
  );
  createWire(
    ledMatrixEl,
    ARDUINO_UNO_PINS.PIN_11,
    'CLK_PIN',
    arduino,
    draw,
    '#2130ff',
    'clk-pin'
  );
};
