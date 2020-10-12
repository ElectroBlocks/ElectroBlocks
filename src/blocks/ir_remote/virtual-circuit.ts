import type { Element, Svg } from "@svgdotjs/svg.js";
import type {
  CreateCompenentHook,
  CreateWire,
  PositionComponent,
} from "../../core/virtual-circuit/svg-create";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type {
  ResetComponent,
  SyncComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  createGroundWire,
  createPowerWire,
  createWire,
} from "../../core/virtual-circuit/wire";
import type { IRRemoteState } from "./state";

export const createIrRemote: CreateCompenentHook<IRRemoteState> = (
  state,
  irRemoteEl
) => {
  irRemoteEl.findOne("#PIN_TEXT").node.innerHTML = state.pins[0];
};

export const positionIrRemote: PositionComponent<IRRemoteState> = (
  state,
  irRemoteEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(
    irRemoteEl,
    arduinoEl,
    draw,
    state.pins[0],
    "PIN_DATA",
    board
  );
};

export const updateIrRemote: SyncComponent = (
  state: IRRemoteState,
  irRemoteEl,
  draw
) => {
  if (!state.hasCode) {
    irRemoteEl.findOne("#remote").hide();
    irRemoteEl.findOne("#code").hide();
    return;
  }

  irRemoteEl.findOne("#remote").show();
  irRemoteEl.findOne("#code").show();
  irRemoteEl.findOne("#code").node.innerHTML = state.code;
  (irRemoteEl.findOne("#code") as Element).cx(55);
};

export const resetIrRemote: ResetComponent = (irRemoteEl: Element) => {
  irRemoteEl.findOne("#remote").hide();
  irRemoteEl.findOne("#code").hide();
};

export const createWiresIrRemote: CreateWire<IRRemoteState> = (
  state,
  draw,
  irRemoteEl,
  arduino,
  id,
  board
) => {
  createWire(
    irRemoteEl,
    state.pins[0],
    "PIN_DATA",
    arduino,
    draw,
    "#3d8938",
    "data",
    board
  );

  createPowerWire(
    irRemoteEl,
    state.pins[0],
    arduino as Svg,
    draw,
    id,
    "left",
    board
  );

  createGroundWire(
    irRemoteEl,
    state.pins[0],
    arduino as Svg,
    draw,
    id,
    "left",
    board
  );
};
