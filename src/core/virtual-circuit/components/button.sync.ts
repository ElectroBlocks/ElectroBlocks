import {
  CreateComponentHook,
  SyncComponent,
  ResetComponent,
  CreateWire,
} from '../svg.component';
import { ButtonState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { createWire, createGroundWire } from '../wire';
import { positionComponent } from '../svg-position';
import { addDraggableEvent } from '../component-events.helpers';

import buttonSvgString from '../svgs/button/button.svg';

export const createButton: CreateComponentHook<ButtonState> = (
  state,
  buttonEl,
  arduinoEl,
  draw
) => {
  buttonEl.findOne('#PIN_TEXT').node.innerHTML = state.pins[0];
  positionComponent(buttonEl, arduinoEl, draw, state.pins[0], 'PIN_DATA');
};

export const updateButton: SyncComponent = (state, frame, draw) => {
  const buttonState = state as ButtonState;
  const id = componentToSvgId(buttonState);
  let buttonEl = draw.findOne('#' + id) as Element;
  if (!buttonEl) {
    console.error('No button El found');
    return;
  }
  toggleButton(buttonEl, buttonState.isPressed);
};

export const resetButton: ResetComponent = (componentEl: Element) => {
  toggleButton(componentEl, false);
};

const toggleButton = (componentEl: Element, isOn: boolean) => {
  console.log('buttonEl update', isOn, componentEl);
  if (isOn) {
    componentEl.findOne('#PRESSED_STATE').show();
    componentEl.findOne('#BUTTON_PRESSED').show();
    componentEl.findOne('#BUTTON_NOT_PRESSED').hide();
    return;
  }

  componentEl.findOne('#PRESSED_STATE').hide();
  componentEl.findOne('#BUTTON_PRESSED').hide();
  componentEl.findOne('#BUTTON_NOT_PRESSED').show();
};

const createWires: CreateWire<ButtonState> = (
  state,
  draw,
  buttonEl,
  arduinoEl,
  id
) => {
  createWire(
    buttonEl,
    state.pins[0],
    'PIN_DATA',
    arduinoEl,
    draw,
    '#3d8938',
    'data'
  );
  createGroundWire(buttonEl, state.pins[0], arduinoEl as Svg, draw, id, 'left');
};
