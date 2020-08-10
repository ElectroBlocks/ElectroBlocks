import { SyncComponent, ResetComponent } from '../svg-sync';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { ButtonState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { createWire, createGroundWire } from '../wire';
import { positionComponent } from '../svg-position';

export const createButton: CreateComponentHook<ButtonState> = (
  state,
  buttonEl,
  arduinoEl,
  draw
) => {
  buttonEl.findOne('#PIN_TEXT').node.innerHTML = state.pins[0];
  positionComponent(buttonEl, arduinoEl, draw, state.pins[0], 'PIN_DATA');
};

export const updateButton: SyncComponent = (state, draw) => {
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

export const createWiresButton: CreateWire<ButtonState> = (
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
