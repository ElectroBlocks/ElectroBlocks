import { Element, Svg } from "@svgdotjs/svg.js";
import _ from "lodash";
import {
  Breadboard,
  BreadBoardArea,
  MicroController,
} from "../microcontroller/microcontroller";
import { ARDUINO_PINS } from "../microcontroller/selectBoard";
import {
  findSvgElement,
  findComponentConnection,
  findArduinoConnectionCenter,
} from "./svg-helpers";

let breadboard: Breadboard = {
  areas: [],
  order: [],
};

export const takeBoardArea = (): BreadBoardArea => {
  const areas = breadboard.areas;
  console.log(breadboard);
  for (let orderIndex in breadboard.order) {
    const areaIndex = breadboard.order[orderIndex];
    const area = areas[areaIndex];
    if (!area.taken) {
      breadboard.areas[areaIndex].taken = true;
      return breadboard.areas[areaIndex];
    }
  }

  return { holes: [], taken: false, color: "" };
};

export const createWireFromArduinoToBreadBoard = (
  pin: ARDUINO_PINS,
  arduinoEl: Svg,
  draw: Svg,
  breadBoardHoleId,
  componentId: string,
  color: string
) => {
  const hole = findBreadboardHoleXY(breadBoardHoleId, arduinoEl, draw);

  const arduinoPin = findArduinoConnectionCenter(
    arduinoEl,
    "ARDUINO_PIN_" + pin
  );

  const line = draw
    .line()
    .plot(hole.x, hole.y, arduinoPin.x, arduinoPin.y)
    .stroke({ width: 2, color, linecap: "round" });

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
  const hole = findBreadboardHoleXY(holeId, arduinoEl, draw);
  const componentPin = findComponentConnection(
    componentEl,
    componentConnectionId
  );
  const line = draw
    .line()
    .plot(hole.x, hole.y, componentPin.x, componentPin.y)
    .stroke({ width: 2, color, linecap: "round" });

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
