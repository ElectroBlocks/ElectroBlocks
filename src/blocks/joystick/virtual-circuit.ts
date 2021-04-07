import { Element } from "@svgdotjs/svg.js";
import {
  AfterComponentCreateHook,
  CreateWire,
  PositionComponent,
} from "../../core/virtual-circuit/svg-create";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  ResetComponent,
  SyncComponent,
} from "../../core/virtual-circuit/svg-sync";
import { JoystickState } from "./state";

export const createWireJoyStick: CreateWire<JoystickState> = (
  state,
  draw,
  joyStickEl,
  arduinoEl,
  id,
  board
) => {};

export const positionJoyStick: PositionComponent<JoystickState> = (
  state,
  joyStickEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;

  positionComponent(joyStickEl, arduinoEl, draw, holes[2], isDown, "PIN_X");
};

export const afterComponentHookJoyStick: AfterComponentCreateHook<JoystickState> = (
  state,
  joyStickEl,
  arduinoEl,
  draw,
  board,
  settings
) => {};

export const updateJoyStick: SyncComponent = (
  state: JoystickState,
  joyStickEl,
  draw,
  frame
) => {
  const movingPart = joyStickEl.findOne("#MOVING_PIECE") as Element;
  const containingPart = joyStickEl.findOne("#Base") as Element;

  const moveBy = 20;
  const radRatio = Math.PI / 180;
  movingPart.cx(
    containingPart.cx() + Math.cos(state.degree * radRatio) * moveBy
  );
  movingPart.cy(
    containingPart.cy() + Math.sin(state.degree * radRatio) * moveBy
  );

  console.log(Math.cos(state.degree * radRatio) * moveBy, "cos");
  console.log(Math.sin(state.degree * radRatio) * moveBy, "sin");
};

export const resetJoyStick: ResetComponent = (joyStickEl) => {};
