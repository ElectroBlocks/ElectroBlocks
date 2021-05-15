import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import type { Element, Svg, Text } from "@svgdotjs/svg.js";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import { WritePinState, WritePinType } from "./state";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";

export const digitalAnalogWritePinReset: ResetComponent = (
  componentEl: Element
) => {
  const pinText = componentEl.findOne("#STATE_TEXT") as Text;
  pinText.node.innerHTML = "OFF";
  const pinTypeText = componentEl.findOne("#PIN_TYPE") as Text;
  pinTypeText.node.innerHTML = "";
  componentEl.findOne("#RAYS").hide();
  (componentEl.findOne("#LIGHT_BULB") as Element).opacity(0);
};

export const digitalAnanlogWritePinPosition: PositionComponent<WritePinState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(componentEl, arduinoEl, draw, holes[2], isDown, "POWER");
};

export const digitalAnanlogWritePinCreate: AfterComponentCreateHook<WritePinState> = (
  state,
  componentEl,
  arduinoEl,
  draw
) => {
  componentEl.data("pin_number", state.pin);

  const pinText = componentEl.findOne("#PIN_TEXT") as Text;
  pinText.node.innerHTML = state.pin;

  const pinTypeText = componentEl.findOne("#PIN_TYPE") as Text;
  pinTypeText.node.innerHTML =
    state.pinType == WritePinType.ANALOG_OUTPUT ? "Analog Pin" : "Digital Pin";
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
  board,
  area
) => {
  const { holes, isDown } = area;

  createGroundOrPowerWire(
    holes[0],
    isDown,
    componentEl,
    draw,
    arduino,
    id,
    "ground"
  );

  createComponentWire(
    holes[2],
    isDown,
    componentEl,
    state.pin,
    draw,
    arduino,
    id,
    "POWER",
    board
  );
};
