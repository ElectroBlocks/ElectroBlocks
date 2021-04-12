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
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";
import { JoystickState } from "./state";

export const createWireJoyStick: CreateWire<JoystickState> = (
  state,
  draw,
  joyStickEl,
  arduinoEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;
  createGroundOrPowerWire(
    holes[0],
    isDown,
    joyStickEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );
  createGroundOrPowerWire(
    holes[1],
    isDown,
    joyStickEl,
    draw,
    arduinoEl,
    id,
    "power"
  );

  createComponentWire(
    holes[2],
    isDown,
    joyStickEl,
    state.xPin,
    draw,
    arduinoEl,
    id,
    "PIN_X",
    board
  );

  createComponentWire(
    holes[3],
    isDown,
    joyStickEl,
    state.yPin,
    draw,
    arduinoEl,
    id,
    "PIN_Y",
    board
  );

  createComponentWire(
    holes[4],
    isDown,
    joyStickEl,
    state.buttonPin,
    draw,
    arduinoEl,
    id,
    "PIN_SW",
    board
  );
};

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
) => {
  joyStickEl.findOne("#PIN_Y_NUMBER").node.innerHTML = state.yPin;
  joyStickEl.findOne("#PIN_X_NUMBER").node.innerHTML = state.xPin;
  joyStickEl.findOne("#PIN_SW_NUMBER").node.innerHTML = state.buttonPin;
};

export const updateJoyStick: SyncComponent = (
  state: JoystickState,
  joyStickEl,
  draw,
  frame
) => {
  const movingPart = joyStickEl.findOne("#MOVING_PIECE") as Element;
  const containingPart = joyStickEl.findOne("#Base") as Element;

  movingPart.cx(containingPart.cx());
  movingPart.cy(containingPart.cy());
  (joyStickEl.findOne("#DEGREES_TEXT") as Element).x(0);

  if (state.engaged) {
    const moveBy = 20;
    const adjustedDegree = state.degree * -1 + 180;
    const radRatio = Math.PI / 180;
    movingPart.cx(
      containingPart.cx() + Math.cos(adjustedDegree * radRatio) * moveBy
    );
    movingPart.cy(
      containingPart.cy() + Math.sin(adjustedDegree * radRatio) * moveBy
    );
    joyStickEl.findOne(
      "#DEGREES_TEXT"
    ).node.innerHTML = `Joystick @ ${state.degree}°`;
    joyStickEl.findOne("#DEGREES_TEXT").show();
  } else {
    joyStickEl.findOne("#DEGREES_TEXT").hide();
  }

  joyStickEl.findOne("#BUTTON_TEXT").node.innerHTML = `Button: ${
    state.buttonPressed ? "ON" : "OFF"
  }`;
};

export const resetJoyStick: ResetComponent = (joyStickEl) => {
  const movingPart = joyStickEl.findOne("#MOVING_PIECE") as Element;
  const containingPart = joyStickEl.findOne("#Base") as Element;

  movingPart.cx(containingPart.cx());
  movingPart.cy(containingPart.cy());
  joyStickEl.findOne("#DEGREES_TEXT").hide();
  joyStickEl.findOne("#BUTTON_TEXT").node.innerHTML = `Button: OFF`;
};
