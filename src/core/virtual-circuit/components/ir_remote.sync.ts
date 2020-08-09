import {
  CreateComponent,
  SyncComponent,
  ResetComponent,
} from '../svg.component';
import { IRRemoteState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import { addDraggableEvent } from '../component-events.helpers';

import irRemoteSvgString from '../svgs/ir_remote/ir_remote.svg';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createIrRemote: CreateComponent = (state, frame, draw) => {
  const irRemoteState = state as IRRemoteState;
  const id = componentToSvgId(irRemoteState);
  let irRemoteEl = draw.findOne('#' + id) as Element;
  if (irRemoteEl) {
    return;
  }

  const arduino = findArduinoEl(draw);
  irRemoteEl = createComponentEl(draw, irRemoteState, irRemoteSvgString);
  (window as any).irRemoteEL = irRemoteEl;
  irRemoteEl.findOne('#PIN_TEXT').node.innerHTML = irRemoteState.pins[0];
  positionComponent(
    irRemoteEl,
    arduino,
    draw,
    irRemoteState.pins[0],
    'PIN_DATA'
  );
  createWires(irRemoteEl, irRemoteState, arduino, draw, id);
  addDraggableEvent(irRemoteEl, arduino, draw);
  updateCode(irRemoteEl, irRemoteState);
};

export const updateIrRemote: SyncComponent = (state, frame, draw) => {
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

const createWires = (
  irRemoteEl: Element,
  state: IRRemoteState,
  arduino: Element,
  draw: Svg,
  componentId: string
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

  createPowerWire(
    irRemoteEl,
    state.pins[0],
    arduino as Svg,
    draw,
    componentId,
    'left'
  );

  createGroundWire(
    irRemoteEl,
    state.pins[0],
    arduino as Svg,
    draw,
    componentId,
    'left'
  );
};
