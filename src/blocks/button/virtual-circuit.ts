import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import type { Element, Svg } from "@svgdotjs/svg.js";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type { ButtonState } from "./state";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";

export const positionButton: PositionComponent<ButtonState> = (
  state,
  buttonEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(buttonEl, arduinoEl, draw, holes[0], isDown, "PIN_GND");
};

export const createButton: AfterComponentCreateHook<ButtonState> = (
  state,
  buttonEl
) => {
  buttonEl.findOne("#PIN_TEXT").node.innerHTML = state.pins[0];
};

export const updateButton: SyncComponent = (
  state: ButtonState,
  buttonEl,
  draw
) => {
  toggleButton(buttonEl, state.isPressed);
};

export const resetButton: ResetComponent = (componentEl: Element) => {
  toggleButton(componentEl, false);
};

const toggleButton = (componentEl: Element, isOn: boolean) => {
  if (isOn) {
    componentEl.findOne("#BUTTON_PRESSED_TEXT").show();
    componentEl.findOne("#BUTTON_TEXT").hide();
    componentEl.findOne("#BUTTON_PRESSED").show();
    componentEl.findOne("#BUTTON_NOT_PRESSED").hide();
    return;
  }

  componentEl.findOne("#BUTTON_PRESSED_TEXT").hide();
  componentEl.findOne("#BUTTON_TEXT").show();
  componentEl.findOne("#BUTTON_PRESSED").hide();
  componentEl.findOne("#BUTTON_NOT_PRESSED").show();
};

export const createWiresButton: CreateWire<ButtonState> = (
  state,
  draw,
  buttonEl,
  arduinoEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;

  createGroundOrPowerWire(
    holes[0],
    isDown,
    buttonEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  createComponentWire(
    holes[3],
    isDown,
    buttonEl,
    state.pins[0],
    draw,
    arduinoEl,
    id,
    "PIN_DATA",
    board
  );
};
