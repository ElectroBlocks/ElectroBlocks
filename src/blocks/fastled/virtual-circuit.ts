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
import _ from 'lodash';
import { rgbToHex } from '../../core/blockly/helpers/color.helper';
import { positionComponent } from '../../core/virtual-circuit/svg-position';
import type { FastLEDState } from './state';
import {
  createComponentWire,
  createGroundOrPowerWire,
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
  const { holes, isDown } = area;
  positionComponent(fastLEDEl, arduino, draw, holes[1], isDown, 'PIN_DATA');
};

export const fastLEDReset: ResetComponent = (fastLEDEl: Element) => {
  for (let i = 1; i <= 60; i += 1) {
    const ledEl = fastLEDEl.findOne(`#LED-${i} circle`) as Element;
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
      `#LED-${led.position + 1} circle`
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
  const { holes, isDown } = area;
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
};

const showRGBStripLeds = (fastLEDEl: Element, fastLEDState: FastLEDState) => {
  let map = {};
  let actualId = 144;
  let currentLed = 1;
  for (let actualId = 133; actualId <= 144; actualId += 1) {
    map[currentLed] = actualId;
    currentLed += 1;
  }
  for (let actualId = 132; actualId >= 121; actualId -= 1) {
    map[actualId] = currentLed;
    currentLed += 1;
  }

  for (let actualId = 109; actualId <= 120; actualId += 1) {
    map[actualId] = currentLed;
    currentLed += 1;
  }

  //   if (fastLEDState.numberOfLeds > 48) {
  //     fastLEDEl.findOne('#LEVEL1').show();
  //     fastLEDEl.findOne('#LEVEL2').show();
  //     fastLEDEl.findOne('#LEVEL3').show();
  //     fastLEDEl.findOne('#LEVEL4').show();
  //   } else if (
  //     fastLEDState.numberOfLeds >= 37 &&
  //     fastLEDState.numberOfLeds <= 48
  //   ) {
  //     fastLEDEl.findOne('#LEVEL1').show();
  //     fastLEDEl.findOne('#LEVEL2').show();
  //     fastLEDEl.findOne('#LEVEL3').show();
  //     fastLEDEl.findOne('#LEVEL4').hide();
  //   } else if (
  //     fastLEDState.numberOfLeds >= 25 &&
  //     fastLEDState.numberOfLeds < 37
  //   ) {
  //     fastLEDEl.findOne('#LEVEL1').show();
  //     fastLEDEl.findOne('#LEVEL2').show();
  //     fastLEDEl.findOne('#LEVEL3').hide();
  //     fastLEDEl.findOne('#LEVEL4').hide();
  //   } else if (
  //     fastLEDState.numberOfLeds >= 13 &&
  //     fastLEDState.numberOfLeds <= 24
  //   ) {
  //     fastLEDEl.findOne('#LEVEL1').show();
  //     fastLEDEl.findOne('#LEVEL2').hide();
  //     fastLEDEl.findOne('#LEVEL3').hide();
  //     fastLEDEl.findOne('#LEVEL4').hide();
  //   } else if (fastLEDState.numberOfLeds <= 12) {
  //     fastLEDEl.findOne('#LEVEL1').hide();
  //     fastLEDEl.findOne('#LEVEL2').hide();
  //     fastLEDEl.findOne('#LEVEL3').hide();
  //     fastLEDEl.findOne('#LEVEL4').hide();
  //   }
};
