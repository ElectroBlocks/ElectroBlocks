import { SyncComponent, ResetComponent } from '../svg-sync';
import { CreateComponentHook } from '../svg-create';

import { Element, Text } from '@svgdotjs/svg.js';
import {
  MotorState,
  MOTOR_DIRECTION,
} from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';

import _ from 'lodash';

export const motorCreate: CreateComponentHook<MotorState> = (
  state,
  motorEl,
  arduinoEl,
  draw
) => {
  motorEl.x(0);
  motorEl.y(10);
  (motorEl.findOne('#motor_info') as Text).node.innerHTML =
    'Motor: ' + state.motorNumber;
};

export const motorUpdate: SyncComponent = (state, draw) => {
  const motorState = state as MotorState;
  const id = componentToSvgId(motorState);
  let motorEl = draw.findOne('#' + id) as Element;

  if (!motorEl) {
    return;
  }

  const directionText = motorState.direction.toString();

  (motorEl.findOne('#direction') as Text).node.innerHTML =
    'Direction: ' +
    directionText.charAt(0).toUpperCase() +
    directionText.slice(1).toLowerCase();

  (motorEl.findOne('#speed') as Text).node.innerHTML =
    'Speed: ' + motorState.speed;
};

export const motorReset: ResetComponent = (componentEl: Element) => {
  (componentEl.findOne('#direction') as Text).node.innerHTML =
    'Direction: ' +
    MOTOR_DIRECTION.FORWARD.charAt(0).toUpperCase() +
    MOTOR_DIRECTION.FORWARD.slice(1).toLowerCase();
  (componentEl.findOne('#speed') as Text).node.innerHTML = 'Speed: 1';
};
