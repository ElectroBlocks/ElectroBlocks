import type { Element, Svg } from "@svgdotjs/svg.js";
import type {
  AfterComponentCreateHook,
  CreateWire,
  PositionComponent,
} from "../../core/virtual-circuit/svg-create";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type {
  ResetComponent,
  SyncComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";
import type { IRRemoteState } from "./state";

export const createIrRemote: AfterComponentCreateHook<IRRemoteState> = (
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
  board,
  area
) => {
  const { holes, isDown } = area;

  positionComponent(irRemoteEl, arduinoEl, draw, holes[1], isDown, "PIN_POWER");
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
  board,
  area
) => {
  const { holes, isDown } = area;

  createGroundOrPowerWire(
    holes[0],
    isDown,
    irRemoteEl,
    draw,
    arduino,
    id,
    "ground"
  );
  createGroundOrPowerWire(
    holes[1],
    isDown,
    irRemoteEl,
    draw,
    arduino,
    id,
    "power"
  );

  createComponentWire(
    holes[2],
    isDown,
    irRemoteEl,
    state.analogPin,
    draw,
    arduino,
    id,
    "PIN_DATA",
    board
  );
};
