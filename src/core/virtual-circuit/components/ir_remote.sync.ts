import { SyncComponent, ResetComponent } from '../svg-sync';
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from '../svg-create';

import { IRRemoteState } from '../../frames/arduino-components.state';
import { Element, Svg } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';

import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createIrRemote: CreateCompenentHook<IRRemoteState> = (
  state,
  irRemoteEl
) => {
  irRemoteEl.findOne('#PIN_TEXT').node.innerHTML = state.pins[0];
};

export const positionIrRemote: PositionComponent<IRRemoteState> = (
  state,
  irRemoteEl,
  arduinoEl,
  draw
) => {
  positionComponent(irRemoteEl, arduinoEl, draw, state.pins[0], 'PIN_DATA');
};

export const updateIrRemote: SyncComponent = (
  state: IRRemoteState,
  irRemoteEl,
  draw
) => {
  if (!state.hasCode) {
    irRemoteEl.findOne('#remote').hide();
    irRemoteEl.findOne('#code').hide();
    return;
  }

  irRemoteEl.findOne('#remote').show();
  irRemoteEl.findOne('#code').show();
  irRemoteEl.findOne('#code').node.innerHTML = state.code;
  (irRemoteEl.findOne('#code') as Element).cx(55);
};

export const resetIrRemote: ResetComponent = (irRemoteEl: Element) => {
  irRemoteEl.findOne('#remote').hide();
  irRemoteEl.findOne('#code').hide();
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
