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
import _ from "lodash";
import resistorSvg from "../../core/virtual-circuit/commonsvgs/resistors/resistor-small.svg";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { positionComponent } from "../../core/virtual-circuit/svg-position-v2";
import { arduinoComponentStateToId } from "../../core/frames/arduino-component-id";
import type { MicroController } from "../../core/microcontroller/microcontroller";
import type { LedState } from "./state";
import {
  createComponentWire,
  createGroundOrPowerWire,
  createWireBreadboard,
  createWireComponentToBreadboard,
  createWireFromArduinoToBreadBoard,
  findResistorBreadboardHoleXY,
  showPin,
} from "../../core/virtual-circuit/wire-v2";

const colors = ["#39b54a", "#ff2a5f", "#1545ff", "#fff76a", "#ff9f3f"];

export const ledCreate: AfterComponentCreateHook<LedState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board,
  settings
) => {
  let ledColor = colors[_.random(0, colors.length - 1)];

  if (settings.customLedColor) {
    ledColor = settings.ledColor;
  }

  ledEl.data("color", ledColor);
  ledEl.data("pin-number", state.pin);
  ledEl
    .find(`#radial-gradient-${state.pin} stop`)
    .toArray()
    .find((stopEl) => +stopEl.attr("offset") === 1)
    .attr("stop-color", ledColor);

  ledEl.data("color", ledColor);
  const pinText = ledEl.findOne("#PIN_NUMBER") as Text;
  pinText.node.innerHTML = state.pin;

  const ledText = ledEl.findOne("#LED_TEXT") as Text;
  ledText.node.innerHTML = "";
};

export const ledPosition: PositionComponent<LedState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes } = area;

  const powerHoleLed = `pin${holes[3]}E`;

  positionComponent(ledEl, arduinoEl, draw, powerHoleLed, "POWER");
};

export const updateLed: SyncComponent = (state: LedState, ledEl, draw) => {
  const stopEl = draw
    .find(`#radial-gradient-${state.pin} stop`)
    .toArray()
    .find((sp) => +sp.attr("offset") === 1);

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
  const ledText = componentEl.findOne("#LED_TEXT") as Text;
  ledText.node.innerHTML = "";

  componentEl
    .find(`#radial-gradient-${componentEl.data("pin-number")} stop`)
    .toArray()
    .find((stop) => +stop.attr("offset") === 1)
    .attr("stop-color", "#FFF");
};

const createResistor = (
  arduino: Svg | Element,
  draw: Svg,
  holeId: string,
  componentId: string
) => {
  const resistorEl = draw.svg(resistorSvg).last();
  resistorEl.data("component-id", componentId);

  const { x, y } = findResistorBreadboardHoleXY(holeId, arduino, draw);
  resistorEl.cx(x);
  resistorEl.y(y);
};

export const createWiresLed: CreateWire<LedState> = (
  state,
  draw,
  ledEl,
  arduino,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;
  createGroundOrPowerWire(holes[1], isDown, ledEl, draw, arduino, id, "ground");
  createComponentWire(
    holes[3],
    isDown,
    ledEl,
    state.pin,
    draw,
    arduino,
    id,
    "POWER",
    board
  );

  const resitorHoleId = `pin${holes[3]}D`;

  createResistor(
    arduino,
    draw,
    resitorHoleId,
    arduinoComponentStateToId(state)
  );
};
