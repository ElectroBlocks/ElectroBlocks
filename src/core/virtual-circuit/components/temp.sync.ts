import { SyncComponent, ResetComponent } from '../svg-sync';
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from '../svg-create';

import { TemperatureState } from '../../frames/arduino-components.state';
import { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../svg-position';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createTemp: CreateCompenentHook<TemperatureState> = (
  state,
  tempEl
) => {
  const pinTextEl = tempEl.findOne('#PIN_TEXT') as Element;
  const cxPosition = pinTextEl.cx();
  pinTextEl.node.innerHTML = state.pins[0];
  pinTextEl.cx(cxPosition);
};

export const positionTemp: PositionComponent<TemperatureState> = (
  state,
  tempEl,
  arduinoEl,
  draw
) => {
  positionComponent(tempEl, arduinoEl, draw, state.pins[0], 'PIN_DATA');
};

export const updateTemp: SyncComponent = (state: TemperatureState, tempEl) => {
  const textEl = tempEl.findOne('#TEMP_TEXT') as Element;
  textEl.show();
  const cx = textEl.cx();
  textEl.node.innerHTML = `${state.humidity}% - ${state.temperature}°F`;
  textEl.cx(cx);
};

export const resetTemp: ResetComponent = (tempEl) => {
  const textEl = tempEl.findOne('#TEMP_TEXT') as Element;
  textEl.hide();
};

export const createWiresTemp: CreateWire<TemperatureState> = (
  state,
  draw,
  componentEl,
  arduionEl,
  id
) => {
  createWire(
    componentEl,
    state.pins[0],
    'PIN_DATA',
    arduionEl,
    draw,
    '#2f5ddd',
    'data'
  );
  createPowerWire(
    componentEl,
    state.pins[0],
    arduionEl as Svg,
    draw,
    id,
    'left'
  );
  createGroundWire(
    componentEl,
    state.pins[0],
    arduionEl as Svg,
    draw,
    id,
    'right'
  );
};
