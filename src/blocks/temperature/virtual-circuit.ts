import {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../../core/virtual-circuit/svg-create";

import { Element, Svg } from "@svgdotjs/svg.js";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  createWire,
  createPowerWire,
  createGroundWire,
} from "../../core/virtual-circuit/wire";
import { TemperatureState } from "./state";

export const createTemp: CreateCompenentHook<TemperatureState> = (
  state,
  tempEl
) => {
  const pinTextEl = tempEl.findOne("#PIN_TEXT") as Element;
  const cxPosition = pinTextEl.cx();
  pinTextEl.node.innerHTML = state.pins[0];
  pinTextEl.cx(cxPosition);
};

export const positionTemp: PositionComponent<TemperatureState> = (
  state,
  tempEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(tempEl, arduinoEl, draw, state.pins[0], "PIN_DATA", board);
};

export const updateTemp: SyncComponent = (state: TemperatureState, tempEl) => {
  const textEl = tempEl.findOne("#TEMP_TEXT") as Element;
  textEl.show();
  const cx = textEl.cx();
  textEl.node.innerHTML = `${state.humidity}% - ${state.temperature}°F`;
  textEl.cx(cx);
};

export const resetTemp: ResetComponent = (tempEl) => {
  const textEl = tempEl.findOne("#TEMP_TEXT") as Element;
  textEl.hide();
};

export const createWiresTemp: CreateWire<TemperatureState> = (
  state,
  draw,
  componentEl,
  arduionEl,
  id,
  board
) => {
  createWire(
    componentEl,
    state.pins[0],
    "PIN_DATA",
    arduionEl,
    draw,
    "#2f5ddd",
    "data",
    board
  );
  createPowerWire(
    componentEl,
    state.pins[0],
    arduionEl as Svg,
    draw,
    id,
    "left",
    board
  );
  createGroundWire(
    componentEl,
    state.pins[0],
    arduionEl as Svg,
    draw,
    id,
    "right",
    board
  );
};
