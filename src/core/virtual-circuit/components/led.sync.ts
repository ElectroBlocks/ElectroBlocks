import { SyncComponent, ResetComponent } from "../svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../svg-create";

import { Element, Svg, Text } from "@svgdotjs/svg.js";
import { PinState, PIN_TYPE } from "../../frames/arduino-components.state";
import _ from "lodash";
import resistorSvg from "../commonsvgs/resistors/resistor-small.svg";
import { ARDUINO_PINS, ANALOG_PINS } from "../../microcontroller/selectBoard";
import {
  findResistorBreadboardHoleXY,
  createGroundWire,
  createWire,
} from "../wire";
import { positionComponent } from "../svg-position";
import { arduinoComponentStateToId } from "../../frames/arduino-component-id";
import { MicroController } from "../../microcontroller/microcontroller";

const colors = ["#39b54a", "#ff2a5f", "#1545ff", "#fff76a", "#ff9f3f"];

export const ledCreate: CreateCompenentHook<PinState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board
) => {
  const randomColor = colors[_.random(0, colors.length)];

  ledEl.data("picture-type", state.pinPicture);
  ledEl.data("pin-number", state.pin);

  ledEl
    .find(`#radial-gradient-${state.pin} stop`)
    .toArray()
    .find((stop) => stop.attr("offset") == 1)
    .attr("stop-color", randomColor);
  ledEl.data("color", randomColor);
  const pinText = ledEl.findOne("#PIN_NUMBER") as Text;
  pinText.node.innerHTML = state.pin;

  createResistor(
    arduinoEl,
    draw,
    state.pin,
    arduinoComponentStateToId(state),
    board
  );
};

export const ledPosition: PositionComponent<PinState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(ledEl, arduinoEl, draw, state.pin, "POWER", board);
};

export const updateLed: SyncComponent = (state: PinState, ledEl, draw) => {
  const stopEl = draw
    .find(`#radial-gradient-${state.pin} stop`)
    .toArray()
    .find((sp) => sp.attr("offset") === 1);

  const ledText = ledEl.findOne("#LED_TEXT") as Text;

  if (state.pinType === PIN_TYPE.DIGITAL_OUTPUT) {
    const color = state.state === 1 ? ledEl.data("color") : "#FFF";
    ledText.node.innerHTML = state.state === 1 ? "ON" : "OFF";
    stopEl.attr("stop-color", color);
  }

  if (state.pinType === PIN_TYPE.ANALOG_OUTPUT) {
    ledText.node.innerHTML = `${state.state}`;
    stopEl.attr("stop-color", ledEl.data("color"));
    (ledEl.findOne("#LED_LIGHT") as Element).opacity(state.state / 255);
  }

  (ledEl.findOne("#LED_TEXT") as Element).cx(10);
};

export const resetLed: ResetComponent = (componentEl: Element) => {
  componentEl
    .find(`#radial-gradient-${componentEl.data("pin-number")} stop`)
    .toArray()
    .find((stop) => stop.attr("offset") == 1)
    .attr("stop-color", "#FFF");
};

const createResistor = (
  arduino: Svg | Element,
  draw: Svg,
  pin: ARDUINO_PINS,
  componentId: string,
  board: MicroController
) => {
  const resistorEl = draw.svg(resistorSvg).last();
  resistorEl.data("component-id", componentId);

  const { x, y } = findResistorBreadboardHoleXY(pin, arduino, draw, board);
  resistorEl.cx(x);
  resistorEl.y(y);
};

export const createWiresLed: CreateWire<PinState> = (
  state,
  draw,
  ledEl,
  arduino,
  id,
  board
) => {
  createGroundWire(ledEl, state.pin, arduino as Svg, draw, id, "left", board);

  createWire(
    ledEl,
    state.pin,
    "POWER",
    arduino,
    draw,
    "#FF0000",
    "POWER",
    board
  );
};
