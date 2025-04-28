import type {
  SyncComponent,
  ResetComponent,
} from '../../core/virtual-circuit/svg-sync';
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from '../../core/virtual-circuit/svg-create';

import type { Dom, Element, Svg } from '@svgdotjs/svg.js';
import { rgbToHex } from '../../core/blockly/helpers/color.helper';
import { positionComponent } from '../../core/virtual-circuit/svg-position';
import type { FastLEDState } from './state';
import {
  createComponentWire, createFromArduinoToComponent,
  createGroundOrPowerWire, createGroundOrPowerWireArduino,
} from '../../core/virtual-circuit/wire';

export const fastLEDCreate: AfterComponentCreateHook<FastLEDState> = (
  state,
  fastLEDEl
) => {
  showRGBStripLeds(fastLEDEl, state);
  fastLEDEl.findOne(
    '#DATA_TEXT'
  ).node.innerHTML = `Data Pin = ${state.pins[0]}`;
};

export const fastLEDPosition: PositionComponent<FastLEDState> = (
  state,
  fastLEDEl,
  arduino,
  draw,
  board,
  area
) => {
  if(area) {
    const {holes, isDown} = area;
    positionComponent(fastLEDEl, arduino, draw, 'PIN_DATA', holes[1], isDown);
  } else {
    positionComponent(fastLEDEl, arduino, draw, 'PIN_DATA');
  }
};

export const fastLEDReset: ResetComponent = (fastLEDEl: Element) => {
  for (let i = 1; i <= 144; i += 1) {
    const ledEl = fastLEDEl.findOne(`#LED-${i} ellipse`) as Element;
    if (ledEl) {
      ledEl.fill('#000000');
    }
  }
};

export const fastLEDUpdate: SyncComponent = (
  state: FastLEDState,
  fastLEDEl
) => {
  state.fastLEDs.forEach((led) => {
    const ledEl = fastLEDEl.findOne(
      `#LED-${led.position + 1} ellipse`
    ) as Element;
    if (ledEl) {
      ledEl.fill(rgbToHex(led.color));
    }
  });
};

export const createWiresFastLEDs: CreateWire<FastLEDState> = (
  state,
  draw,
  fastLEDEl,
  arduino,
  id,
  board,
  area
) => {
  if(area) {
    const {holes, isDown} = area;
    createComponentWire(
        holes[1],
        isDown,
        fastLEDEl,
        state.pins[0],
        draw,
        arduino,
        id,
        'PIN_DATA',
        board
    );

    createGroundOrPowerWire(
        holes[0],
        isDown,
        fastLEDEl,
        draw,
        arduino,
        id,
        'ground'
    );
    createGroundOrPowerWire(
        holes[2],
        isDown,
        fastLEDEl,
        draw,
        arduino,
        id,
        'power'
    );
  } else {

    console.log('Piins', state.pins)
    createFromArduinoToComponent(
        draw,
        arduino as Svg,
        state.pins[0],
        fastLEDEl,
        "PIN_DATA",
        board
    );
    createGroundOrPowerWireArduino(
        draw, arduino as Svg, state.pins[0], fastLEDEl, board, "ground"
    );
    createGroundOrPowerWireArduino(
        draw, arduino as Svg, state.pins[0], fastLEDEl, board, "power"
    );
  }
};

const showRGBStripLeds = (fastLEDEl: Element, fastLEDState: FastLEDState) => {
  const { numberOfLeds } = fastLEDState;
  for (let i = 1; i <= 144; i += 1) {
    let led = fastLEDEl.findOne(`#LED_${i}`);
    if (!led) break;

    if (i <= numberOfLeds) {
      led.show();
    } else {
      led.hide();
    }
  }

  toggleShowHide(fastLEDEl.findOne('#LEVEL_11'), numberOfLeds >= 133);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_10'), numberOfLeds >= 121);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_9'), numberOfLeds >= 109);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_8'), numberOfLeds >= 97);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_7'), numberOfLeds >= 85);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_6'), numberOfLeds >= 73);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_5'), numberOfLeds >= 61);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_4'), numberOfLeds >= 49);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_3'), numberOfLeds >= 37);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_2'), numberOfLeds >= 25);
  toggleShowHide(fastLEDEl.findOne('#LEVEL_1'), numberOfLeds >= 13);
};

const toggleShowHide = (el: Dom, show: boolean) => {
  if (!el) return;

  if (show) {
    el.show();
  } else {
    el.hide();
  }
};
