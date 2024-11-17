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
  createWireBreadboard,
  createWireComponentToBreadboard,
  createWireFromArduinoToBreadBoard,
  findBreadboardHoleXY,
  getGroundorPowerWireLetter,
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
  buttonEl.data("disableDraggable", "TRUE");
  const { holes, isDown } = area;
  positionComponent(buttonEl, arduinoEl, draw, holes[0], isDown, "PIN_1");
  const holeId = `pin${holes[0]}F`;
  const hole = findBreadboardHoleXY(holeId, arduinoEl, draw);
  buttonEl.y(hole.y - 2);
};

export const createButton: AfterComponentCreateHook<ButtonState> = (
  state,
  buttonEl
) => {
  return;
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
    componentEl.findOne("#HIDE_PRESSED").hide();
    componentEl.findOne("#BOTTOM_WIRE").show();
    componentEl.findOne("#TOP_WIRE").show();
    return;
  }

  componentEl.findOne("#BOTTOM_WIRE").hide();
  componentEl.findOne("#TOP_WIRE").hide();
  componentEl.findOne("#HIDE_PRESSED").show();
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
  if (state.usePullup) {
    createGroundOrPowerWire(
      holes[0],
      isDown,
      buttonEl,
      draw,
      arduino,
      id,
      "power",
      "PIN_1",
      true
    );
    const holeId = `pin${holes[2]}A`;
    createWireFromArduinoToBreadBoard(
      state.pins[0],
      arduino as Svg,
      draw,
      holeId,
      id,
      board
    );
    return;
  }

  createGroundOrPowerWire(
    holes[0],
    isDown,
    buttonEl,
    draw,
    arduino,
    id,
    "power",
    "PIN_1",
    true
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
  const groundBreadBoard = `pin${holes[4]}${getGroundorPowerWireLetter(
    true,
    "ground"
  )}`;

  createWireBreadboard(
    groundBreadBoard,
    `pin${holes[4]}A`,
    "#000",
    draw,
    arduino as Svg,
    id
  );

  const holeId = `pin${holes[2]}H`;
  createWireFromArduinoToBreadBoard(
    state.pins[0],
    arduino as Svg,
    draw,
    holeId,
    id,
    board
  );
};
