import { CreateComponent, SyncComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { NeoPixelState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import rgbLedLightStripSvg from '../svgs/rgbledlightstrip/rgbledlightstrip.svg';
import {
  updateWires,
  createWire,
  createPowerWire,
  createGroundWire,
} from '../wire';
import { positionComponent } from '../svg-position';
import _, { indexOf } from 'lodash';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';

export const neoPixelCreate: CreateComponent = (
  state,
  frame,
  draw,
  showArduino
) => {
  if (state.type !== ArduinoComponentType.NEO_PIXEL_STRIP) {
    return;
  }

  const neoPixelState = state as NeoPixelState;

  const id = componentToSvgId(neoPixelState);
  let neoPixelEl = draw.findOne('#' + id) as Element;
  const arduino = draw.findOne('#arduino_main_svg') as Element;
  if (showArduino && neoPixelEl) {
    showRGBStripLeds(neoPixelEl, neoPixelState);
    createWires(neoPixelEl, neoPixelState.pins[0], arduino as Svg, draw, id);
    return;
  }

  if (neoPixelEl && !showArduino) {
    showRGBStripLeds(neoPixelEl, neoPixelState);

    draw
      .find('line')
      .filter((w) => w.data('component-id') === id)
      .forEach((w) => w.remove());
    return;
  }

  neoPixelEl = draw.svg(rgbLedLightStripSvg).last();
  neoPixelEl.addClass('component');
  neoPixelEl.attr('id', id);
  neoPixelEl.data('component-type', state.type);
  (neoPixelEl as Svg).viewbox(0, 0, neoPixelEl.width(), neoPixelEl.height());
  (neoPixelEl as any).draggable().on('dragmove', (e) => {
    if (showArduino) {
      updateWires(neoPixelEl, draw, arduino as Svg);
    }
  });
  (window as any).neoPixelEl = neoPixelEl;

  if (showArduino) {
    arduino.y(draw.viewbox().y2 - arduino.height() + 100);
    createWires(neoPixelEl, ARDUINO_UNO_PINS.PIN_13, arduino as Svg, draw, id);
  }

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
