import { CreateComponentHook, CreateWire } from './svg.component';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from './svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import {
  ArduinoComponentState,
  ArduinoComponentType,
} from '../frames/arduino.frame';
import { addDraggableEvent } from './component-events.helpers';
import { positionComponent } from './svg-position';
import { ARDUINO_UNO_PINS } from '../blockly/selectBoard';
import { ArduinoReceiveMessageState } from '../frames/arduino-components.state';

export const createComponent = (
  state: ArduinoComponentState,
  frame,
  draw: Svg
): void => {
  if (state.type === ArduinoComponentType.MESSAGE) {
    createComponent[state.type](state, frame, draw);
    return;
  }

  const id = componentToSvgId(state);
  let componentEl = draw.findOne('#' + id) as Element;
  const arduino = findArduinoEl(draw);
  if (componentEl) {
    return;
  }

  componentEl = createComponentEl(draw, state, getSvgString(state));
  addDraggableEvent(componentEl, arduino, draw);
  (window as any)[state.type] = componentEl;
  createComponent[state.type](state, frame, draw);
};

const getSvgString = (state: ArduinoComponentState) => {
  return '';
};

const createWires: {[key in ArduinoComponentType]: CreateWire<ArduinoComponentState> } => {
  [ArduinoComponentType.BLUE_TOOTH]:  

}