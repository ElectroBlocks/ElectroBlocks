import {
  CreateComponent,
  SyncComponent,
  ResetComponent,
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

export const createButton: CreateComponent = (state, frame, draw) => {
  const buttonState = state as ButtonState;
  const id = componentToSvgId(buttonState);
  let buttonEl = draw.findOne('#' + id) as Element;
  if (buttonEl) {
    return;
  }

  const arduino = findArduinoEl(draw);
  buttonEl = createComponentEl(draw, buttonState, buttonSvgString);
  (window as any).buttonEl = buttonEl;
  buttonEl.findOne('#PIN_TEXT').node.innerHTML = buttonState.pins[0];
  positionComponent(buttonEl, arduino, draw, buttonState.pins[0], 'PIN_DATA');
  createWires(buttonEl, buttonState, arduino, draw, id);
  addDraggableEvent(buttonEl, arduino, draw);
  toggleButton(buttonEl, buttonState.isPressed);
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

const createWires = (
  buttonEl: Element,
  state: ButtonState,
  arduino: Element,
  draw: Svg,
  componentId: string
) => {
  createWire(
    buttonEl,
    state.pins[0],
    'PIN_DATA',
    arduino,
    draw,
    '#3d8938',
    'data'
  );
  createGroundWire(
    buttonEl,
    state.pins[0],
    arduino as Svg,
    draw,
    componentId,
    'left'
  );
};
