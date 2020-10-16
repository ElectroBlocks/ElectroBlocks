import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../../core/virtual-circuit/svg-create";

import type { Element, Svg, Text } from "@svgdotjs/svg.js";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  ANALOG_PINS,
  ARDUINO_PINS,
} from "../../core/microcontroller/selectBoard";
import { createGroundWire, createWire } from "../../core/virtual-circuit/wire";
import { WritePinState, WritePinType } from "./state";

export const digitalAnalogWritePinReset: ResetComponent = (
  componentEl: Element
) => {
  const pinText = componentEl.findOne("#STATE_TEXT") as Text;
  pinText.node.innerHTML = "OFF";
  componentEl.findOne("#RAYS").hide();
  (componentEl.findOne("#LIGHT_BULB") as Element).opacity(0);
};

export const digitalAnanlogWritePinPosition: PositionComponent<WritePinState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  board) => {
  positionComponent(componentEl, arduinoEl, draw, state.pin, "POWER", board);
};

export const digitalAnanlogWritePinCreate: CreateCompenentHook<WritePinState> = (
  state,
  componentEl,
  arduinoEl,
  draw
) => {
  componentEl.data("pin_number", state.pin);

  const pinText = componentEl.findOne("#PIN_TEXT") as Text;
  pinText.node.innerHTML = state.pin;
};

export const digitalAnalogWritePinSync: SyncComponent = (
  state: WritePinState,
  pinEl,
  draw
) => {
  const pinText = pinEl.findOne("#STATE_TEXT") as Text;

  if (state.pinType === WritePinType.DIGITAL_OUTPUT) {
    if (state.state === 1) {
      pinText.node.innerHTML = "ON";
      pinEl.findOne("#RAYS").show();
      pinEl.findOne("#LIGHT_BULB").show();
      (pinEl.findOne("#LIGHT_BULB") as Element).opacity(1);
    } else {
      pinText.node.innerHTML = "OFF";
      (pinEl.findOne("#LIGHT_BULB") as Element).opacity(0);
      pinEl.findOne("#RAYS").hide();
    }
  }

  if (state.pinType === WritePinType.ANALOG_OUTPUT) {
    const pinText = pinEl.findOne("#STATE_TEXT") as Text;
    pinText.node.innerHTML = state.state.toString();
    pinEl.findOne("#RAYS").show();
    pinEl.findOne("#LIGHT_BULB").show();

    (pinEl.findOne("#RAYS") as Element).opacity(state.state / 255);
    (pinEl.findOne("#LIGHT_BULB") as Element).opacity(state.state / 255);
  }

  pinText.cx(16);
};

export const createWiresDigitalAnalogWrite: CreateWire<WritePinState> = (
  state,
  draw,
  componentEl,
  arduino,
  id,
  board
) => {
  createGroundWire(
    componentEl,
    state.pin,
    arduino as Svg,
    draw,
    id,
    "left",
    board
  );
  createWire(
    componentEl,
    state.pin,
    "POWER",
    arduino,
    draw,
    "#FF0000",
    "POWER",
    board
  );
};
