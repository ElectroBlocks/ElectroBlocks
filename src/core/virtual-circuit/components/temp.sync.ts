import { SyncComponent, ResetComponent } from '../svg.component';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { TemperatureState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../svg-position';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createTemp: CreateComponentHook<TemperatureState> = (
  state,
  tempEl,
  arduinoEl,
  draw
) => {
  positionComponent(tempEl, arduinoEl, draw, state.pins[0], 'PIN_DATA');
  const pinTextEl = tempEl.findOne('#PIN_TEXT') as Element;
  const cxPosition = pinTextEl.cx();
  pinTextEl.node.innerHTML = state.pins[0];
  pinTextEl.cx(cxPosition);
};

export const updateTemp: SyncComponent = (state, draw) => {
  const tempState = state as TemperatureState;

  const id = componentToSvgId(tempState);
  let tempEl = draw.findOne('#' + id) as Element;
  updateTempText(tempEl, tempState);
};

export const resetTemp: ResetComponent = (tempEl) => {
  const textEl = tempEl.findOne('#TEMP_TEXT') as Element;
  textEl.hide();
};

const updateTempText = (componentEl: Element, state: TemperatureState) => {
  const textEl = componentEl.findOne('#TEMP_TEXT') as Element;
  textEl.show();
  const cx = textEl.cx();
  textEl.node.innerHTML = `${state.humidity}% - ${state.temperature}°F`;
  textEl.cx(cx);
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
