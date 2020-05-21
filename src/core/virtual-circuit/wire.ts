import {
  findBreadboardHoleXY,
  findComponentConnection,
  pinToBreadboardHole,
  findSvgElement,
} from './svg-helpers';
import { Svg, Element, Line } from '@svgdotjs/svg.js';
import { ARDUINO_UNO_PINS } from '../../constants/arduino';
import _ from 'lodash';

export interface Wire {
  id: string;
  pointBreadboardId: string;
  pointComponentId: string;
}

export enum WIRE_COLOR {
  GND = '#000000',
  POWER = '#FF422A',
}

export const createWire = (
  element: Element,
  pin: ARDUINO_UNO_PINS,
  connectionId: string,
  arduino: Element,
  draw: Svg,
  color: string,
  componentId: string,
  type: string
) => {
  const hole = findBreadboardHoleXY(pin, arduino, draw);
  const componentPin = findComponentConnection(element, connectionId);
  const line = draw
    .line()
    .plot(hole.x, hole.y, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: color, linecap: 'round' });
  line.data('component-id', componentId);
  line.data('wire-type', type);

  return line;
};

export const createGroundWire = (
  element: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentBoxId: string,
  componentId: string,
  direction: 'left' | 'right'
) => {
  const holeId = takeClosestBottomBreadboardHole(pin, direction);
  const hole = findSvgElement(`pin${holeId}X`, arduino);
  const holeX = hole.cx() + arduino.x();
  const holeY = hole.cy() + arduino.y();
  const componentPin = findComponentConnection(element, componentBoxId);
  const line = draw
    .line()
    .plot(holeX, holeY, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: WIRE_COLOR.GND, linecap: 'round' });
  line.data('component-id', componentId);
  line.data('wire-type', 'GND');

  return line;
};

export const createPowerWire = (
  element: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentBoxId: string,
  componentId: string,
  direction: 'left' | 'right'
) => {
  const holeId = takeClosestBottomBreadboardHole(pin, direction);
  const hole = findSvgElement(`pin${holeId}W`, arduino);
  const holeX = hole.cx() + arduino.x();
  const holeY = hole.cy() + arduino.y();
  const componentPin = findComponentConnection(element, componentBoxId);
  const line = draw
    .line()
    .plot(holeX, holeY, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: WIRE_COLOR.POWER, linecap: 'round' });
  line.data('component-id', componentId);
  line.data('wire-type', 'POWER');

  return line;
};

export const updateWire = (
  element: Element,
  connectionId: string,
  line: Line
) => {
  const componentPin = findComponentConnection(element, connectionId);
  const [[holeX, holeY]] = line.plot();
  line.plot(holeX, holeY, componentPin.x, componentPin.y);
};

let bottomBreadBoardHoles: Array<{
  status: 'available' | 'taken';
  position: number;
}> = [];

const skipHolesList = [
  6,
  9,
  13,
  18,
  22,
  27,
  31,
  37,
  41,
  46,
  51,
  54,
  58,
  61,
  56,
  50,
  44,
  38,
  32,
  26,
  20,
  14,
  8,
];

export const takeNextBottomBreadboardHole = () => {
  const hole = bottomBreadBoardHoles
    .sort((holeA, holeB) => (holeA.position > holeB.position ? 1 : -1))
    .find(({ status }) => status === 'available');

  hole.status = 'taken';

  return hole.position;
};

export const takeClosestBottomBreadboardHole = (
  pin: ARDUINO_UNO_PINS,
  direction: 'right' | 'left'
) => {
  const pinNumber = parseInt(
    pinToBreadboardHole(pin).replace('pin', '').replace('C', ''),
    0
  );

  let sortedHoles = bottomBreadBoardHoles
    .sort((a, b) => {
      return (
        Math.abs(a.position - pinNumber) - Math.abs(b.position - pinNumber)
      );
    })
    .filter((hole) =>
      direction === 'right'
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
      (hole) => hole.status === 'available'
    );

    selectedBreadBoardHole.status = 'taken';
    return selectedBreadBoardHole.position;
  }

  const selectedHole = sortedHoles.find((hole) => hole.status === 'available');

  selectedHole.status = 'taken';
  return selectedHole.position;
};

export const returnBottomHole = (position: number) => {
  const index = bottomBreadBoardHoles.findIndex(
    (hole) => hole.position === position
  );

  bottomBreadBoardHoles[index].status = 'available';
};

export const resetBreadBoardWholes = () => {
  bottomBreadBoardHoles = _.range(4, 62)
    .filter((i) => !skipHolesList.includes(i))
    .map((i) => {
      return { status: 'available', position: i };
    });
};
