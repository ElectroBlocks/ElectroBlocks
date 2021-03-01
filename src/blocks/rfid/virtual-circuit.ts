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
import type { RfidState } from "./state";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";

export const positionRfid: PositionComponent<RfidState> = (
  state,
  rfidEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(rfidEl, arduinoEl, draw, holes[0], isDown, "PIN_GND");
};

export const createRfid: AfterComponentCreateHook<RfidState> = (
  state,
  rfidEl
) => {
  rfidEl.findOne("#PIN_TEXT_RX").node.innerHTML = state.txPin;
};

export const updateRfid: SyncComponent = (state: RfidState, rfidEl) => {
  if (!state.scannedCard) {
    rfidEl.findOne("#RFID").hide();
    return;
  }
  rfidEl.findOne("#RFID").show();
  rfidEl.findOne(
    "#CARD_NUMBER_TEXT"
  ).node.innerHTML = `Card #: "${state.cardNumber}"`;
  rfidEl.findOne("#TAG_TEXT").node.innerHTML = `Tag #: "${state.tag}"`;
};

export const resetRfid: ResetComponent = (rfidEl: Element) => {
  rfidEl.findOne("#RFID").hide();
};

export const createWiresRfid: CreateWire<RfidState> = (
  state,
  draw,
  rfidEl,
  arduinoEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;
  createGroundOrPowerWire(
    holes[0],
    isDown,
    rfidEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  createGroundOrPowerWire(
    holes[1],
    isDown,
    rfidEl,
    draw,
    arduinoEl,
    id,
    "power"
  );

  createComponentWire(
    holes[2],
    isDown,
    rfidEl,
    state.txPin,
    draw,
    arduinoEl,
    id,
    "PIN_TX",
    board
  );
};
