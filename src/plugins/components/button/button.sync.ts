import {
  SyncComponent,
  ResetComponent,
} from "../../../core/virtual-circuit/svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../../../core/virtual-circuit/svg-create";

import { ButtonState } from "../../../core/frames/arduino-components.state";
import { Element, Svg } from "@svgdotjs/svg.js";
import {
  createWire,
  createGroundWire,
} from "../../../core/virtual-circuit/wire";
import { positionComponent } from "../../../core/virtual-circuit/svg-position";

export const positionButton: PositionComponent<ButtonState> = (
  state,
  buttonEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(
    buttonEl,
    arduinoEl,
    draw,
    state.pins[0],
    "PIN_DATA",
    board
  );
};

export const createButton: CreateCompenentHook<ButtonState> = (
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
  console.log("buttonEl update", isOn, componentEl);
  if (isOn) {
    componentEl.findOne("#PRESSED_STATE").show();
    componentEl.findOne("#BUTTON_PRESSED").show();
    componentEl.findOne("#BUTTON_NOT_PRESSED").hide();
    return;
  }

  componentEl.findOne("#PRESSED_STATE").hide();
  componentEl.findOne("#BUTTON_PRESSED").hide();
  componentEl.findOne("#BUTTON_NOT_PRESSED").show();
};

export const createWiresButton: CreateWire<ButtonState> = (
  state,
  draw,
  buttonEl,
  arduinoEl,
  id,
  board
) => {
  createWire(
    buttonEl,
    state.pins[0],
    "PIN_DATA",
    arduinoEl,
    draw,
    "#3d8938",
    "data",
    board
  );
  createGroundWire(
    buttonEl,
    state.pins[0],
    arduinoEl as Svg,
    draw,
    id,
    "left",
    board
  );
};
