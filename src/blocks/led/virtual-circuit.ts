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
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import { arduinoComponentStateToId } from "../../core/frames/arduino-component-id";
import type { LedState } from "./state";
import {
  createWireComponentToBreadboard,
  createGroundOrPowerWire,
  createResistor,
  createWireFromArduinoToBreadBoard,
} from "../../core/virtual-circuit/wire";

export const ledColors = [
  "red",
  "green",
  "blue",
  "yellow",
  "white",
  "purple",
  "orange",
];
export const lightColorsShades: { [key: string]: string } = {
  red: "#ff8080",
  green: "#80ff80",
  blue: "#8080ff",
  yellow: "#ffff80",
  orange: "#ffcf80",
  white: "#ffffff",
  purple: "#ff80ff",
};

export const ledCreate: AfterComponentCreateHook<LedState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board,
  settings
) => {
  changeLedColor(state, ledEl);
  const pinText = ledEl.findOne("#PIN_NUMBER") as Text;
  pinText.node.innerHTML = state.pin;

  const ledText = ledEl.findOne("#LED_TEXT") as Text;
  ledText.node.innerHTML = "";
  (ledEl.findOne("#LIGHT_ON") as Element).node.style.opacity =
    state.state.toString();
};

export const ledPosition: PositionComponent<LedState> = (
  state,
  ledEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;

  positionComponent(ledEl, arduinoEl, draw, holes[3], isDown, "POWER");
};

export const updateLed: SyncComponent = (state: LedState, ledEl, draw) => {
  const ledText = ledEl.findOne("#LED_TEXT") as Text;
  if (!state.fade) {
    ledText.node.innerHTML = state.state === 1 ? "on" : "off";
    (ledEl.findOne("#LIGHT_ON") as Element).node.style.opacity =
      state.state.toString();
  }
  if (state.fade) {
    ledText.node.innerHTML = `${state.state}`;
    (ledEl.findOne("#LIGHT_ON") as Element).node.style.opacity = (
      state.state / 125
    ).toString();
  }
  ledText.cx(23);
  changeLedColor(state, ledEl);
};

export const resetLed: ResetComponent = (componentEl: Element) => {
  const ledText = componentEl.findOne("#LED_TEXT") as Text;
  ledText.node.innerHTML = "";
  (componentEl.findOne("#LIGHT_ON") as Element).node.style.opacity = "0";
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

  const color = board.pinConnections[state.pin].color;
  createWireComponentToBreadboard(
    `pin${holes[2]}${isDown ? "E" : "F"}`,
    ledEl,
    draw,
    arduino,
    "POWER",
    id,
    color
  );

  createResistor(
    arduino,
    draw,
    holes[2],
    false,
    arduinoComponentStateToId(state),
    "horizontal",
    300
  );

  const holeId = `pin${holes[4]}${isDown ? "A" : "J"}`;
  createWireFromArduinoToBreadBoard(
    state.pins[0],
    arduino as Svg,
    draw,
    holeId,
    id,
    board
  );
};

const changeLedColor = (state: LedState, ledEl: Element) => {
  const hexColor = state.color;
  const mapColor = {
    "#ff0000": "red",
    "#008000": "green",
    "#0000ff": "blue",
    "#ffff00": "yellow",
    "#ffffff": "white",
    "#800080": "purple",
    "#ffa500": "orange",
  };
  let ledColor = mapColor[hexColor];
  let ledLightColor = lightColorsShades[ledColor];

  ledEl.data("pin-number", state.pin);

  ledEl.data("color", ledColor);
  const mainColor = ledEl.findOne("#MAIN_COLOR") as Element;
  mainColor.fill(ledColor);
  const secondColorEl = ledEl.findOne("#SECOND_COLOR") as Element;
  secondColorEl.fill(ledLightColor);
};
