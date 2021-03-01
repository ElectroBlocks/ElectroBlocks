import { Element, Line, Svg } from "@svgdotjs/svg.js";
import _ from "lodash";
import {
  Breadboard,
  BreadBoardArea,
  MicroController,
} from "../microcontroller/microcontroller";
import { ANALOG_PINS, ARDUINO_PINS } from "../microcontroller/selectBoard";
import {
  findSvgElement,
  findComponentConnection,
  findArduinoConnectionCenter,
} from "./svg-helpers";

let breadboard: Breadboard = {
  areas: [],
  order: [],
};

export const takeBoardArea = (): BreadBoardArea | null => {
  const areas = breadboard.areas;
  for (let orderIndex in breadboard.order) {
    const areaIndex = breadboard.order[orderIndex];
    const area = areas[areaIndex];
    if (!area.taken) {
      breadboard.areas[areaIndex].taken = true;
      return breadboard.areas[areaIndex];
    }
  }

  return null;
};

export const createWireFromArduinoToBreadBoard = (
  pin: ARDUINO_PINS,
  arduinoEl: Svg,
  draw: Svg,
  breadBoardHoleId,
  componentId: string,
  board: MicroController
) => {
  const hole = findBreadboardHoleXY(breadBoardHoleId, arduinoEl, draw);
  const pinConnection = board.pinConnections[pin];
  const arduinoPin = findArduinoConnectionCenter(arduinoEl, pinConnection.id);

  const line = draw
    .line()
    .plot(hole.x, hole.y, arduinoPin.x, arduinoPin.y)
    .stroke({ width: 2, color: pinConnection.color, linecap: "round" });

  line.data("component-id", componentId);
  line.data("type", "wire");
  line.data("update-wire", false);
};

export const createWireComponentToBreadboard = (
  holeId: string,
  componentEl: Element,
  draw: Svg,
  arduinoEl: Svg | Element,
  componentConnectionId: string,
  componentId: string,
  color: string
) => {
  console.log(holeId, componentConnectionId, "look");
  const hole = findBreadboardHoleXY(holeId, arduinoEl, draw);
  const componentPin = findComponentConnection(
    componentEl,
    componentConnectionId
  );
  console.log(componentConnectionId, componentPin, "loop");
  const line = draw
    .line()
    .plot(hole.x, hole.y, componentPin.x, componentPin.y)
    .stroke({ width: 2, color, linecap: "round" });
  (window as any).WIRE_TEST = line;
  line.data("connection-id", componentConnectionId);
  line.data("component-id", componentId);
  line.data("type", "wire");
  line.data("update-wire", true);
  line.data("hole-id", holeId);
};

export const createWireBreadboard = (
  holeIdA: string,
  holeIdB: string,
  color: string,
  draw: Svg,
  arduinoEl: Svg,
  componentId: string
) => {
  const holeA = findBreadboardHoleXY(holeIdA, arduinoEl, draw);
  const holeB = findBreadboardHoleXY(holeIdB, arduinoEl, draw);

  const line = draw
    .line()
    .plot(holeA.x, holeA.y, holeB.x, holeB.y)
    .stroke({ width: 2, color, linecap: "round" });

  line.data("component-id", componentId);
  line.data("type", "wire");
  line.data("update-wire", false);
};

const getGroundorPowerWireLetter = (
  isDown: boolean,
  type: "ground" | "power"
) => {
  if (isDown && type === "power") {
    return "W";
  }

  if (isDown && type === "ground") {
    return "X";
  }

  if (!isDown && type === "power") {
    return "Y";
  }

  return "Z";
};

export const createGroundOrPowerWire = (
  hole: number,
  isDown: boolean,
  componentEl: Element,
  draw: Svg,
  arduino: Element,
  componentId: string,
  type: "ground" | "power"
) => {
  const groundHole = `pin${hole}${isDown ? "E" : "F"}`;
  const pinConnectionId = type === "ground" ? "PIN_GND" : "PIN_POWER";
  const color = type === "ground" ? "#000" : "#AA0000";
  const breadBoardHoleA = `pin${hole}${isDown ? "A" : "J"}`;
  const breadBoardHoleB = `pin${hole}${getGroundorPowerWireLetter(
    isDown,
    type
  )}`;

  createWireComponentToBreadboard(
    groundHole,
    componentEl,
    draw,
    arduino,
    pinConnectionId,
    componentId,
    color
  );

  createWireBreadboard(
    breadBoardHoleA,
    breadBoardHoleB,
    color,
    draw,
    arduino as Svg,
    componentId
  );
};

export const createComponentWire = (
  hole: number,
  isDown: boolean,
  componentEl: Element,
  pin: ARDUINO_PINS,
  draw: Svg,
  arduino: Element,
  componentId: string,
  connectionId: string,
  board: MicroController
) => {
  const holeId = `pin${hole}${isDown ? "E" : "F"}`;
  const breadboardHoleIdToBoard = `pin${hole}${isDown ? "A" : "J"}`;
  const color = board.pinConnections[pin].color;
  createWireComponentToBreadboard(
    holeId,
    componentEl,
    draw,
    arduino,
    connectionId,
    componentId,
    color
  );

  showPin(draw, pin);

  createWireFromArduinoToBreadBoard(
    pin,
    arduino as Svg,
    draw,
    breadboardHoleIdToBoard,
    componentId,
    board
  );
};

export const findBreadboardHoleXY = (
  pinHoleId,
  arduino: Element,
  draw: Svg
) => {
  const hole = findSvgElement(pinHoleId, draw);
  return {
    x: hole.cx() + arduino.x(),
    y: hole.cy() + arduino.y(),
  };
};

export const findResistorBreadboardHoleXY = (
  holeId: string,
  arduino: Element,
  draw: Svg
) => {
  const hole = findSvgElement(holeId, draw);
  (window as any).hole = hole;
  return {
    x: hole.cx() + arduino.x(),
    y: (hole.findOne("circle") as Element).cy() + arduino.y() - 1,
  };
};

export const resetBreadBoardHoles = (board: MicroController) => {
  breadboard = _.cloneDeep(board.breadboard);
};

export const showPin = (draw: Svg, pin: ARDUINO_PINS) => {
  if (ANALOG_PINS.includes(pin)) {
    const wire = draw.findOne(`#${pin}`);
    if (wire) {
      wire.show();
    }
  }
};

export const hideAllAnalogWires = (draw: Svg) => {
  ANALOG_PINS.forEach((pin) => {
    const wire = draw.findOne(`#${pin}`);
    if (wire) {
      wire.hide();
    }
  });
};
