import {
  CreateComponentHook,
  SyncComponent,
  ResetComponent,
  CreateWire,
} from '../svg.component';
import { NeoPixelState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  createComponentEl,
  findArduinoEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import neopixelSvgString from '../svgs/neopixel/neopixel.svg';
import { createWire, createPowerWire, createGroundWire } from '../wire';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import _ from 'lodash';
import { rgbToHex } from '../../blockly/helpers/color.helper';

export const neoPixelCreate: CreateComponentHook<NeoPixelState> = (
  state,
  neoPixelEl,
  arduinoEl,
  draw
) => {
  arduinoEl.y(draw.viewbox().y2 - arduinoEl.height() + 100);
  showRGBStripLeds(neoPixelEl, state);
};

export const neoPixelReset: ResetComponent = (neoPixelEl: Element) => {
  for (let i = 1; i <= 60; i += 1) {
    const ledEl = neoPixelEl.findOne(`#LED-${i} circle`) as Element;
    if (ledEl) {
      ledEl.fill('#000000');
    }
  }
};

export const neoPixelUpdate: SyncComponent = (state, frame, draw) => {
  const neoPixelState = state as NeoPixelState;
  const id = componentToSvgId(neoPixelState);
  let neoPixelEl = draw.findOne('#' + id) as Element;

  if (!neoPixelEl) {
    console.error('ERROR NO NEOPIXEL FOUND');
    return;
  }

  neoPixelState.neoPixels.forEach((led) => {
    const ledEl = neoPixelEl.findOne(
      `#LED-${led.position + 1} circle`
    ) as Element;
    ledEl.fill(rgbToHex(led.color));
  });
};

const createWires: CreateWire<NeoPixelState> = (
  state,
  draw,
  neoPixelEl,
  arduino,
  id
) => {
  createWire(
    neoPixelEl,
    state.pins[0],
    'PIN_DATA',
    arduino,
    draw,
    '#006837',
    'data'
  );

  createGroundWire(
    neoPixelEl,
    ARDUINO_UNO_PINS.PIN_13,
    arduino as Svg,
    draw,
    id,
    'left'
  );

  createPowerWire(
    neoPixelEl,
    ARDUINO_UNO_PINS.PIN_13,
    arduino as Svg,
    draw,
    id,
    'left'
  );
};

const showRGBStripLeds = (
  neoPixelEl: Element,
  neoPixelState: NeoPixelState
) => {
  _.range(1, 60 + 1).forEach((index) => {
    if (index <= neoPixelState.numberOfLeds) {
      neoPixelEl.findOne(`#LED_${index}`).show();
    } else {
      neoPixelEl.findOne(`#LED_${index}`).hide();
    }
  });
  if (neoPixelState.numberOfLeds > 48) {
    neoPixelEl.findOne('#LEVEL1').show();
    neoPixelEl.findOne('#LEVEL2').show();
    neoPixelEl.findOne('#LEVEL3').show();
    neoPixelEl.findOne('#LEVEL4').show();
  } else if (
    neoPixelState.numberOfLeds >= 37 &&
    neoPixelState.numberOfLeds <= 48
  ) {
    neoPixelEl.findOne('#LEVEL1').show();
    neoPixelEl.findOne('#LEVEL2').show();
    neoPixelEl.findOne('#LEVEL3').show();
    neoPixelEl.findOne('#LEVEL4').hide();
  } else if (
    neoPixelState.numberOfLeds >= 25 &&
    neoPixelState.numberOfLeds < 37
  ) {
    neoPixelEl.findOne('#LEVEL1').show();
    neoPixelEl.findOne('#LEVEL2').show();
    neoPixelEl.findOne('#LEVEL3').hide();
    neoPixelEl.findOne('#LEVEL4').hide();
  } else if (
    neoPixelState.numberOfLeds >= 13 &&
    neoPixelState.numberOfLeds <= 24
  ) {
    neoPixelEl.findOne('#LEVEL1').show();
    neoPixelEl.findOne('#LEVEL2').hide();
    neoPixelEl.findOne('#LEVEL3').hide();
    neoPixelEl.findOne('#LEVEL4').hide();
  } else if (neoPixelState.numberOfLeds < 12) {
    neoPixelEl.findOne('#LEVEL1').hide();
    neoPixelEl.findOne('#LEVEL2').hide();
    neoPixelEl.findOne('#LEVEL3').hide();
    neoPixelEl.findOne('#LEVEL4').hide();
  }
};
