import { findComponentConnection, findSvgElement } from "./svg-helpers";
import { Svg, Element, Line } from "@svgdotjs/svg.js";
import { ARDUINO_PINS } from "../microcontroller/selectBoard";
import _ from "lodash";
import { MicroController } from "../microcontroller/microcontroller";

export interface Wire {
  id: string;
  pointBreadboardId: string;
  pointComponentId: string;
}

export enum WIRE_COLOR {
  GND = "#000000",
  POWER = "#FF422A",
}

export const createWire = (
  element: Element,
  pin: ARDUINO_PINS,
  connectionId: string,
  arduino: Element,
  draw: Svg,
  color: string,
  type: string,
  board: MicroController
) => {
  const hole = findBreadboardHoleXY(pin, arduino, draw, board);
  const componentPin = findComponentConnection(element, connectionId);
  const line = draw
    .line()
    .plot(hole.x, hole.y, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: color, linecap: "round" });
  line.data("connection-id", connectionId);
  line.data("component-id", element.id());
  line.data("wire-type", type);
  line.data("type", "wire");
  line.data("hole-id", board.pinToBreadboardHole(pin));

  return line;
};

export const createGroundWire = (
  element: Element,
  pin: ARDUINO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string,
  direction: "left" | "right",
  board: MicroController
) => {
  return createBottomBreadboardWire(
    element,
    pin,
    arduino,
    draw,
    "PIN_GND",
    componentId,
    "GND",
    direction,
    board
  );
};

export const createPowerWire = (
  element: Element,
  pin: ARDUINO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string,
  direction: "left" | "right",
  board: MicroController
) => {
  return createBottomBreadboardWire(
    element,
    pin,
    arduino,
    draw,
    "PIN_POWER",
    componentId,
    "POWER",
    direction,
    board
  );
};

const createBottomBreadboardWire = (
  element: Element,
  pin: ARDUINO_PINS,
  arduino: Svg,
  draw: Svg,
  componentBoxId: string,
  componentId: string,
  wireType: "POWER" | "GND",
  direction: "left" | "right",
  board: MicroController
) => {
  const breadBoardLetter = wireType === "POWER" ? "W" : "X";
  const wireColor = wireType === "POWER" ? WIRE_COLOR.POWER : WIRE_COLOR.GND;
  const holeId = takeClosestBottomBreadboardHole(pin, direction, board);
  const hole = findSvgElement(`pin${holeId}${breadBoardLetter}`, arduino);
  const holeX = hole.cx() + arduino.x();
  const holeY = hole.cy() + arduino.y();
  const componentPin = findComponentConnection(element, componentBoxId);
  (window as any).componentPin = componentPin;
  const line = draw
    .line()
    .plot(holeX, holeY, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: wireColor, linecap: "round" });
  line.data("component-id", componentId);
  line.data("connection-id", componentBoxId);
  line.data("hole-id", `pin${holeId}${breadBoardLetter}`);
  line.data("wire-type", "POWER");
  line.data("type", "wire");

  (window as any).line = line;
  return line;
};

export const updateWires = (element: Element, draw: Svg, arduino: Svg) => {
  const wires = (draw.find(
    `[data-component-id=${element.id()}]`
  ) as any[]) as Line[];
  wires
    .filter((w) => {
      return w.data("type") == "wire";
    })
    .forEach((w) => {
      const holeId = w.data("hole-id");
      const hole = findSvgElement(holeId, arduino);
      const holeX = hole.cx() + arduino.x();
      const holeY = hole.cy() + arduino.y();

      const connectionId = w.data("connection-id");
      const componentPin = findComponentConnection(element, connectionId);
      w.plot(holeX, holeY, componentPin.x, componentPin.y);
    });
};

let bottomBreadBoardHoles: Array<{
  status: "available" | "taken";
  position: number;
}> = [];

export const takeNextBottomBreadboardHole = () => {
  const hole = bottomBreadBoardHoles
    .sort((holeA, holeB) => (holeA.position > holeB.position ? 1 : -1))
    .find(({ status }) => status === "available");

  hole.status = "taken";

  return hole.position;
};

export const takeClosestBottomBreadboardHole = (
  pin: ARDUINO_PINS,
  direction: "right" | "left",
  board: MicroController
) => {
  const pinNumber = parseInt(
    board.pinToBreadboardHole(pin).replace("pin", "").replace("C", ""),
    0
  );

  let sortedHoles = bottomBreadBoardHoles
    .sort((a, b) => {
      return (
        Math.abs(a.position - pinNumber) - Math.abs(b.position - pinNumber)
      );
    })
    .filter((hole) =>
      direction === "right"
        ? hole.position > pinNumber
        : hole.position < pinNumber
    );

  if (sortedHoles.length === 0) {
    sortedHoles = bottomBreadBoardHoles.sort((a, b) => {
      return (
        Math.abs(a.position - pinNumber) - Math.abs(b.position - pinNumber)
      );
    });

    const selectedBreadBoardHole = sortedHoles.find(
      (hole) => hole.status === "available"
    );

    selectedBreadBoardHole.status = "taken";
    return selectedBreadBoardHole.position;
  }

  const selectedHole = sortedHoles.find((hole) => hole.status === "available");

  selectedHole.status = "taken";
  return selectedHole.position;
};

export const returnBottomHole = (position: number) => {
  const index = bottomBreadBoardHoles.findIndex(
    (hole) => hole.position === position
  );

  bottomBreadBoardHoles[index].status = "available";
};

export const resetBreadBoardWholes = (board: MicroController) => {
  bottomBreadBoardHoles = _.range(4, 62)
    .filter((i) => !board.skipHoles.includes(i))
    .map((i) => {
      return { status: "available", position: i };
    });
};

export const findBreadboardHoleXY = (
  pin: ARDUINO_PINS,
  arduino: Element,
  draw: Svg,
  board: MicroController
) => {
  const hole = findSvgElement(board.pinToBreadboardHole(pin), draw);
  return {
    x: hole.cx() + arduino.x(),
    y: hole.cy() + arduino.y(),
  };
};

export const findResistorBreadboardHoleXY = (
  pin: ARDUINO_PINS,
  arduino: Element,
  draw: Svg,
  board: MicroController
) => {
  const hole = findSvgElement(
    board.pinToBreadboardHole(pin).replace("E", "D").replace("F", "I"),
    draw
  );
  (window as any).hole = hole;
  return {
    x: hole.cx() + arduino.x(),
    y: (hole.findOne("circle") as Element).cy() + arduino.y() - 1,
  };
};
