import {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../../core/virtual-circuit/svg-create";

import { Element, Svg, Text } from "@svgdotjs/svg.js";
import _ from "lodash";
import resistorSvg from "../../core/virtual-circuit/commonsvgs/resistors/resistor-small.svg";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  findResistorBreadboardHoleXY,
  createGroundWire,
  createWire,
} from "../../core/virtual-circuit/wire";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import { arduinoComponentStateToId } from "../../core/frames/arduino-component-id";
import { MicroController } from "../../core/microcontroller/microcontroller";
import { LedState } from "./state";

const colors = ["#39b54a", "#ff2a5f", "#1545ff", "#fff76a", "#ff9f3f"];

export const ledCreate: CreateCompenentHook<LedState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board
) => {
  const randomColor = colors[_.random(0, colors.length)];

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

export const ledPosition: PositionComponent<LedState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(ledEl, arduinoEl, draw, state.pin, "POWER", board);
};

export const updateLed: SyncComponent = (state: LedState, ledEl, draw) => {
  const stopEl = draw
    .find(`#radial-gradient-${state.pin} stop`)
    .toArray()
    .find((sp) => sp.attr("offset") === 1);

  const ledText = ledEl.findOne("#LED_TEXT") as Text;

  if (!state.fade) {
    const color = state.state === 1 ? ledEl.data("color") : "#FFF";
    ledText.node.innerHTML = state.state === 1 ? "ON" : "OFF";
    stopEl.attr("stop-color", color);
  }

  if (state.fade) {
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
  debugger;
  const resistorEl = draw.svg(resistorSvg).last();
  resistorEl.data("component-id", componentId);

  const { x, y } = findResistorBreadboardHoleXY(pin, arduino, draw, board);
  resistorEl.cx(x);
  resistorEl.y(y);
};

export const createWiresLed: CreateWire<LedState> = (
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
