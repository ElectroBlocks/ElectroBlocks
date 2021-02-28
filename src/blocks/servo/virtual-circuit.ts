import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  AfterComponentCreateHook,
  CreateWire,
} from "../../core/virtual-circuit/svg-create";

import { findSvgElement } from "../../core/virtual-circuit/svg-helpers";
import type { Svg, Text, Element } from "@svgdotjs/svg.js";
import {
  createWire,
  createGroundWire,
  createPowerWire,
} from "../../core/virtual-circuit/wire";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type { ServoState } from "./state";

export const servoReset: ResetComponent = (servoEl) => {
  setDegrees(servoEl, 0);
  setText(servoEl, 0);
};

export const servoUpdate: SyncComponent = (state: ServoState, servoEl) => {
  setDegrees(servoEl, state.degree);

  setText(servoEl, state.degree);
};

export const servoCreate: AfterComponentCreateHook<ServoState> = (
  state,
  servoEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  setServoPinText(servoEl, state);
};

export const servoPosition: PositionComponent<ServoState> = (
  state,
  servoEl,
  arduinoEl,
  draw,
  board
) => {
  positionComponent(servoEl, arduinoEl, draw, state.pins[0], "PIN_DATA", board);
};

const setServoPinText = (servoEl: Element, servoState: ServoState) => {
  const servoName = servoEl.findOne("#servo_pin") as Text;
  servoName.node.textContent = servoState.pins[0].toString();
};

const setText = (servoEl: Element, degrees: number) => {
  const degreeText = servoEl.findOne("#degrees") as Text;

  degreeText.node.textContent = `${degrees}˚`;
  degreeText.cx(40);
};

const setDegrees = (servoEl: Element, degrees: number) => {
  // TODO FIX DEGREES
  const servoBoundBox = findSvgElement("CenterOfCicle", servoEl).bbox();
  const movingPart = findSvgElement("moving_part", servoEl);
  const currentDegrees = movingPart.transform().rotate;
  movingPart.rotate(-currentDegrees, servoBoundBox.x, servoBoundBox.y);
  movingPart.rotate(-1 * (degrees + 4), servoBoundBox.cx, servoBoundBox.cy);
};

export const createWiresServo: CreateWire<ServoState> = (
  state,
  draw,
  servoEl,
  arduino,
  id,
  board
) => {
  const pin = state.pins[0];
  createWire(servoEl, pin, "PIN_DATA", arduino, draw, "#FFA502", "data", board);

  // if ([ARDUINO_PINS.PIN_13, ARDUINO_PINS.PIN_A2].includes(pin)) {
  //   // GND then POWER
  //   createGroundWire(servoEl, pin, arduino as Svg, draw, id, "left");

  //   createPowerWire(servoEl, pin, arduino as Svg, draw, id, "left");
  // }

  // POWER THEN GND

  createPowerWire(servoEl, pin, arduino as Svg, draw, id, "left", board);

  createGroundWire(servoEl, pin, arduino as Svg, draw, id, "left", board);
};
