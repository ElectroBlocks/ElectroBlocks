import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import type { ThermistorState } from "./state";
import type { Svg, Text, Element } from "@svgdotjs/svg.js";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  createGroundOrPowerWire,
  createResistor,
  createWireFromArduinoToBreadBoard,
} from "../../core/virtual-circuit/wire";

export const positionThermistorSensor: PositionComponent<ThermistorState> = (
  state,
  thermistorEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(
    thermistorEl,
    arduinoEl,
    draw,
    holes[0],
    isDown,
    "PIN_POWER"
  );
};

export const createThermistorSensorHook: AfterComponentCreateHook<ThermistorState> = (
  state,
  thermistorEl
) => {
  const textEl = thermistorEl.findOne("#WIRE_TEXT") as Text;
  textEl.node.textContent = state.pins[0];
};

export const updateThermistorSensor: SyncComponent = (
  state: ThermistorState,
  thermistorEl
) => {
  const textEl = thermistorEl.findOne("#TEMP_TEXT") as Text;
  textEl.node.textContent = `${state.temp}°C`;
};

export const resetThermistorSensor: ResetComponent = (thermistorEl) => {};

export const createThermistorWires: CreateWire<ThermistorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
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
    arduinoEl,
    id,
    "power"
  );

  createResistor(
    arduinoEl,
    draw,
    holes[1],
    false,
    id,
    "horizontal",
    state.externalResistorsOhms
  );

  createGroundOrPowerWire(
    holes[1],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  const holeId = `pin${holes[3]}${isDown ? "A" : "J"}`;
  createWireFromArduinoToBreadBoard(
    state.pins[0],
    arduinoEl as Svg,
    draw,
    holeId,
    id,
    board
  );
};
