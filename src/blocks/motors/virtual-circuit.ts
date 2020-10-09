import {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  PositionComponent,
  CreateCompenentHook,
} from "../../core/virtual-circuit/svg-create";

import { Element, Text } from "@svgdotjs/svg.js";
import { MotorState, MOTOR_DIRECTION } from "./state";

import _ from "lodash";

export const motorPosition: PositionComponent<MotorState> = (
  state,
  motorEl
) => {
  motorEl.x(0);
  motorEl.y(10);
};

export const motorCreate: CreateCompenentHook<MotorState> = (
  state,
  motorEl
) => {
  motorEl.findOne("#motor_info").node.innerHTML = "Motor: " + state.motorNumber;
};

export const motorUpdate: SyncComponent = (state: MotorState, motorEl) => {
  const directionText = state.direction.toString();

  (motorEl.findOne("#direction") as Text).node.innerHTML =
    "Direction: " +
    directionText.charAt(0).toUpperCase() +
    directionText.slice(1).toLowerCase();

  (motorEl.findOne("#speed") as Text).node.innerHTML = "Speed: " + state.speed;
};

export const motorReset: ResetComponent = (componentEl: Element) => {
  (componentEl.findOne("#direction") as Text).node.innerHTML =
    "Direction: " +
    MOTOR_DIRECTION.FORWARD.charAt(0).toUpperCase() +
    MOTOR_DIRECTION.FORWARD.slice(1).toLowerCase();
  (componentEl.findOne("#speed") as Text).node.innerHTML = "Speed: 1";
};
