import { CreateComponent, SyncComponent } from '../svg.component';
import { NeoPixelState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  createComponentEl,
  findArduinoEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import rgbLedLightStripSvg from '../svgs/rgbledlightstrip/rgbledlightstrip.svg';
import { createWire, createPowerWire, createGroundWire } from '../wire';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import _ from 'lodash';

export const neoPixelCreate: CreateComponent = (state, frame, draw) => {
  const neoPixelState = state as NeoPixelState;

  const id = componentToSvgId(neoPixelState);
  let neoPixelEl = draw.findOne('#' + id) as Element;
  const arduino = findArduinoEl(draw);

  if (neoPixelEl) {
    showRGBStripLeds(neoPixelEl, neoPixelState);
    createWires(neoPixelEl, neoPixelState.pins[0], arduino as Svg, draw, id);
    return;
  }

  neoPixelEl = createComponentEl(draw, state, rgbLedLightStripSvg);
  (window as any).neoPixelEl = neoPixelEl;
  arduino.y(draw.viewbox().y2 - arduino.height() + 100);
  createWires(neoPixelEl, ARDUINO_UNO_PINS.PIN_13, arduino as Svg, draw, id);
  showRGBStripLeds(neoPixelEl, neoPixelState);
};

export const rgbLedLightStripUpdate: SyncComponent = (state, frame, draw) => {};

const createWires = (
  neoPixelEl: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string
) => {
  createWire(neoPixelEl, pin, 'CONNECT_DATA', arduino, draw, '#006837', 'data');

  createGroundWire(
    neoPixelEl,
    ARDUINO_UNO_PINS.PIN_13,
    arduino,
    draw,
    'CONNECT_GND',
    componentId,
    'left'
  );

  createPowerWire(
    neoPixelEl,
    pin,
    arduino,
    draw,
    'CONNECT_POWER',
    componentId,
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
