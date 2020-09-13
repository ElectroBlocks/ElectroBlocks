import { SyncComponent, ResetComponent } from "../svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../svg-create";

import { Element, Svg, Text } from "@svgdotjs/svg.js";
import { PinState, PinPicture } from "../../frames/arduino-components.state";
import { positionComponent } from "../svg-position";
import { ANALOG_PINS, ARDUINO_PINS } from "../../microcontroller/selectBoard";
import { createGroundWire, createWire, updateWires } from "../wire";

export const digitalAnalogWritePinReset: ResetComponent = (
  componentEl: Element
) => {
  const pinText = componentEl.findOne("#STATE_TEXT") as Text;
  pinText.node.innerHTML = "OFF";
  componentEl.findOne("#RAYS").hide();
  (componentEl.findOne("#LIGHT_BULB") as Element).opacity(0);
};

export const digitalAnanlogWritePinPosition: CreateCompenentHook<PinState> = (
  state,
  componentEl,
  arduinoEl,
  draw
) => {
  positionComponent(componentEl, arduinoEl, draw, state.pin, "POWER");
  componentEl.x(componentEl.x() + 30);
};

export const digitalAnanlogWritePinCreate: PositionComponent<PinState> = (
  state,
  componentEl,
  arduinoEl,
  draw
) => {
  componentEl.data("picture-type", state.pinPicture);
  componentEl.data("pin_number", state.pin);

  setPinText(state.pin, componentEl);
};

export const digitalAnalogWritePinSync: SyncComponent = (
  state: PinState,
  pinEl,
  draw
) => {
  const pinText = pinEl.findOne("#STATE_TEXT") as Text;

  if (state.pinPicture === PinPicture.LED_DIGITAL_WRITE) {
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

  if (state.pinPicture === PinPicture.LED_ANALOG_WRITE) {
    const pinText = pinEl.findOne("#STATE_TEXT") as Text;
    pinText.node.innerHTML = state.state.toString();
    pinEl.findOne("#RAYS").show();
    pinEl.findOne("#LIGHT_BULB").show();

    (pinEl.findOne("#RAYS") as Element).opacity(state.state / 255);
    (pinEl.findOne("#LIGHT_BULB") as Element).opacity(state.state / 255);
  }

  pinText.cx(16);
};

export const createWiresDigitalAnalogWrite: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduino,
  id
) => {
  createGroundWire(componentEl, state.pin, arduino as Svg, draw, id, "right");
  createWire(
    componentEl,
    state.pin,
    "POWER",
    arduino,
    draw,
    "#FF0000",
    "POWER"
  );
};

const setPinText = (pin: ARDUINO_PINS, componentEl: Element) => {
  const pinText = componentEl.findOne("#PIN_TEXT") as Text;
  pinText.node.innerHTML = pin;
  if (ANALOG_PINS.includes(pin)) {
    pinText.x(-10);
    return;
  }

  if (
    [ARDUINO_PINS.PIN_10, ARDUINO_PINS.PIN_11, ARDUINO_PINS.PIN_12].includes(
      pin
    )
  ) {
    pinText.x(-8);
  }
};
