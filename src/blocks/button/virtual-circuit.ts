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
  createResistor,
  createWireComponentToBreadboard,
  createWireFromArduinoToBreadBoard,
} from "../../core/virtual-circuit/wire";
import { arduinoComponentStateToId } from "../../core/frames/arduino-component-id";

export const positionButton: PositionComponent<ButtonState> = (
  state,
  buttonEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(
    buttonEl,
    arduinoEl,
    draw,
    holes[0],
    isDown,
    "PIN_GND_POWER"
  );
};

export const createButton: AfterComponentCreateHook<ButtonState> = (
  state,
  buttonEl
) => {
  buttonEl.findOne("#PIN_TEXT").node.innerHTML = state.pins[0];
  buttonEl.findOne("#PIN_TEXT_TYPE").node.innerHTML = state.usePullup
    ? "-"
    : "+";
  buttonEl
    .findOne("#PIN_TEXT_TYPE")
    .node.setAttribute("font-size", state.usePullup ? "36px" : "30px");
  buttonEl
    .findOne("#PIN_GND_POWER")
    .node.setAttribute("stroke", state.usePullup ? "#020101" : "#AA0000");
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
  arduino,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;
  console.log(state.usePullup);
  if (state.usePullup) {
    createGroundOrPowerWire(
      holes[0],
      isDown,
      buttonEl,
      draw,
      arduino,
      id,
      "ground",
      "PIN_GND_POWER"
    );

    createComponentWire(
      holes[3],
      isDown,
      buttonEl,
      state.pins[0],
      draw,
      arduino,
      id,
      "PIN_DATA",
      board
    );
    return;
  }

  createGroundOrPowerWire(
    holes[1],
    isDown,
    buttonEl,
    draw,
    arduino,
    id,
    "power",
    "PIN_GND_POWER"
  );

  const color = board.pinConnections[state.pins[0]].color;
  createWireComponentToBreadboard(
    `pin${holes[2]}${isDown ? "E" : "F"}`,
    buttonEl,
    draw,
    arduino,
    "PIN_DATA",
    id,
    color
  );

  createResistor(
    arduino,
    draw,
    holes[2],
    false,
    arduinoComponentStateToId(state),
    "horizontal",
    10000
  );

  const holeId = `pin${holes[4]}${isDown ? "A" : "J"}`;
  createWireFromArduinoToBreadBoard(
    state.pins[0],
    arduino as Svg,
    draw,
    holeId,
    id,
    board
  );
};
