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
import type { Element, Svg } from "@svgdotjs/svg.js";
import resistorSvg from "../../core/virtual-circuit/commonsvgs/resistors/resistor-tiny.svg";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { MicroController } from "../../core/microcontroller/microcontroller";

export const positionThermistorSensor: PositionComponent<ThermistorState> = (
  state,
  thermistorEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(thermistorEl, arduinoEl, draw, holes[0], isDown, "PIN_GND");
};

export const createThermistorSensorHook: AfterComponentCreateHook<ThermistorState> = (
  state,
  thermistorEl
) => {};

export const updateThermistorSensor: SyncComponent = (
  state: ThermistorState,
  thermistorEl
) => {};

export const resetThermistorSensor: ResetComponent = (thermistorEl) => {};

export const createThermistorWires: CreateWire<ThermistorState> = (
  state,
  draw,
  componentEl,
  arduionEl,
  id,
  board
) => {};
