import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import type { Element, Text } from "@svgdotjs/svg.js";
import { MotorShieldState, MOTOR_DIRECTION } from "./state";

import _ from "lodash";

export const motorPosition: PositionComponent<MotorShieldState> = (
  state,
  motorEl
) => {
  motorEl.x(110);
  motorEl.y(-305);
};

export const motorCreate: AfterComponentCreateHook<MotorShieldState> = (
  state,
  motorEl
) => {
  if (state.numberOfMotors === 1) {
    motorEl.findOne("#MOTOR_2").hide();
  } else {
    motorEl.findOne("#MOTOR_2").show();
  }
};

export const motorUpdate: SyncComponent = (
  state: MotorShieldState,
  motorEl
) => {
  motorEl.findOne("#MOTOR_1_SPEED").node.innerHTML = `Speed: ${state.speed1}`;
  motorEl.findOne(
    "#MOTOR_1_DIRECTION"
  ).node.innerHTML = `Direction: ${state.direction1}`;
  motorEl.findOne("#MOTOR_2_SPEED").node.innerHTML = `Speed: ${state.speed2}`;
  motorEl.findOne(
    "#MOTOR_2_DIRECTION"
  ).node.innerHTML = `Direction: ${state.direction2}`;
  // const directionText = state.direction.toString();
  // const animationSpeed = (1 / state.speed) * 50 + "s"; // Calculate animation duration based on speed
  // if (state.speed == 0) {
  //   motorEl.findOne("#motor").node.style.animation = "none";
  // } else {
  //   motorEl.findOne("#motor").node.style.animation =
  //     state.direction === MOTOR_DIRECTION.CLOCKWISE
  //       ? `rotate ${animationSpeed} linear infinite`
  //       : `rotateAntiClockwise ${animationSpeed} linear infinite`;
  // }
  // (motorEl.findOne("#direction") as Text).node.innerHTML =
  //   "Direction: " +
  //   directionText.charAt(0).toUpperCase() +
  //   directionText.slice(1).toLowerCase();
  // (motorEl.findOne("#speed") as Text).node.innerHTML = "Speed: " + state.speed;
};

export const motorReset: ResetComponent = (componentEl: Element) => {
  // (componentEl.findOne("#direction") as Text).node.innerHTML =
  //   "Direction: " +
  //   MOTOR_DIRECTION.CLOCKWISE.charAt(0).toUpperCase() +
  //   MOTOR_DIRECTION.CLOCKWISE.slice(1).toLowerCase();
  // (componentEl.findOne("#speed") as Text).node.innerHTML = "Speed: 1";
};
