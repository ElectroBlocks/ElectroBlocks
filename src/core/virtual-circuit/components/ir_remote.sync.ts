import { SyncComponent, ResetComponent } from '../svg-sync';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { IRRemoteState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';

import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createIrRemote: CreateComponentHook<IRRemoteState> = (
  state,
  irRemoteEl,
  arduinoEl,
  draw
) => {
  irRemoteEl.findOne('#PIN_TEXT').node.innerHTML = state.pins[0];
  positionComponent(irRemoteEl, arduinoEl, draw, state.pins[0], 'PIN_DATA');
};

export const updateIrRemote: SyncComponent = (state, draw) => {
  const irRemoteState = state as IRRemoteState;
  const id = componentToSvgId(irRemoteState);
  let irRemoteEl = draw.findOne('#' + id) as Element;
  updateCode(irRemoteEl, irRemoteState);
};

export const resetIrRemote: ResetComponent = (irRemoteEl: Element) => {
  irRemoteEl.findOne('#remote').hide();
  irRemoteEl.findOne('#code').hide();
};

const updateCode = (irRemoteEl: Element, irRemoteState: IRRemoteState) => {
  if (!irRemoteState.hasCode) {
    irRemoteEl.findOne('#remote').hide();
    irRemoteEl.findOne('#code').hide();
    return;
  }

  irRemoteEl.findOne('#remote').show();
  irRemoteEl.findOne('#code').show();
  irRemoteEl.findOne('#code').node.innerHTML = irRemoteState.code;
  (irRemoteEl.findOne('#code') as Element).cx(55);
};

export const createWiresIrRemote: CreateWire<IRRemoteState> = (
  state,
  draw,
  irRemoteEl,
  arduino,
  id
) => {
  createWire(
    irRemoteEl,
    state.pins[0],
    'PIN_DATA',
    arduino,
    draw,
    '#3d8938',
    'data'
  );

  createPowerWire(irRemoteEl, state.pins[0], arduino as Svg, draw, id, 'left');

  createGroundWire(irRemoteEl, state.pins[0], arduino as Svg, draw, id, 'left');
};
