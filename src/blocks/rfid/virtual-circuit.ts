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
import { RfidState } from "./state";

export const positionRfid: PositionComponent<RfidState> = (
  state,
  rfidEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(rfidEl, arduinoEl, draw, state.txPin, "PIN_TX", board);
  rfidEl.x(rfidEl.x() + 100);
};

export const createRfid: CreateCompenentHook<RfidState> = (state, rfidEl) => {
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
  board
) => {
  createWire(
    rfidEl,
    state.txPin,
    "PIN_TX",
    arduinoEl,
    draw,
    "#dda824",
    "tx-pin",
    board
  );
  createPowerWire(
    rfidEl,
    state.txPin,
    arduinoEl as Svg,
    draw,
    id,
    "left",
    board
  );
  createGroundWire(
    rfidEl,
    state.txPin,
    arduinoEl as Svg,
    draw,
    id,
    "left",
    board
  );
};
