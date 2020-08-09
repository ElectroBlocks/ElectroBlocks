import {
  CreateComponent,
  SyncComponent,
  ResetComponent,
} from '../svg.component';
import { TemperatureState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';

import tempSvgString from '../svgs/temp/temp-humidity.svg';
import { addDraggableEvent } from '../component-events.helpers';
import { positionComponent } from '../svg-position';
import { createWire, createPowerWire, createGroundWire } from '../wire';
import { text } from 'svelte/internal';

export const createTemp: CreateComponent = (state, frame, draw) => {
  const tempState = state as TemperatureState;

  const id = componentToSvgId(tempState);
  let tempEl = draw.findOne('#' + id) as Element;
  const arduinoEl = findArduinoEl(draw);

  if (tempEl) {
    return;
  }

  tempEl = createComponentEl(draw, state, tempSvgString);
  (window as any).tempEl = tempEl;
  positionComponent(tempEl, arduinoEl, draw, tempState.pins[0], 'PIN_DATA');
  addDraggableEvent(tempEl, arduinoEl, draw);
  createWires(tempEl, tempState, draw, id, arduinoEl);
  updateTempText(tempEl, tempState);
};

export const updateTemp: SyncComponent = (state, frame, draw) => {
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

const createWires = (
  componentEl: Element,
  state: TemperatureState,
  draw: Svg,
  id: string,
  arduionEl: Element
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
