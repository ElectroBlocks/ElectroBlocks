import { findComponentConnection, findSvgElement } from './svg-helpers';
import { Svg, Element, Line } from '@svgdotjs/svg.js';
import { ARDUINO_UNO_PINS } from '../blockly/selectBoard';
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
  type: string
) => {
  const hole = findBreadboardHoleXY(pin, arduino, draw);
  const componentPin = findComponentConnection(element, connectionId);
  const line = draw
    .line()
    .plot(hole.x, hole.y, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: color, linecap: 'round' });
  line.data('connection-id', connectionId);
  line.data('component-id', element.id());
  line.data('wire-type', type);
  line.data('type', 'wire');
  line.data('hole-id', pinToBreadboardHole(pin));

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
  return createBottomBreadboardWire(
    element,
    pin,
    arduino,
    draw,
    componentBoxId,
    componentId,
    'GND',
    direction
  );
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
  return createBottomBreadboardWire(
    element,
    pin,
    arduino,
    draw,
    componentBoxId,
    componentId,
    'POWER',
    direction
  );
};

const createBottomBreadboardWire = (
  element: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentBoxId: string,
  componentId: string,
  wireType: 'POWER' | 'GND',
  direction: 'left' | 'right'
) => {
  const breadBoardLetter = wireType === 'POWER' ? 'W' : 'X';
  const wireColor = wireType === 'POWER' ? WIRE_COLOR.POWER : WIRE_COLOR.GND;
  const holeId = takeClosestBottomBreadboardHole(pin, direction);
  const hole = findSvgElement(`pin${holeId}${breadBoardLetter}`, arduino);
  const holeX = hole.cx() + arduino.x();
  const holeY = hole.cy() + arduino.y();
  const componentPin = findComponentConnection(element, componentBoxId);
  (window as any).componentPin = componentPin;
  const line = draw
    .line()
    .plot(holeX, holeY, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: wireColor, linecap: 'round' });
  line.data('component-id', componentId);
  line.data('connection-id', componentBoxId);
  line.data('hole-id', `pin${holeId}${breadBoardLetter}`);
  line.data('wire-type', 'POWER');
  line.data('type', 'wire');

  (window as any).line = line;
  return line;
};

export const updateWires = (element: Element, draw: Svg, arduino: Svg) => {
  const wires = (draw.find(
    `[data-component-id=${element.id()}]`
  ) as any[]) as Line[];
  wires
    .filter((w) => {
      return w.data('type') == 'wire';
    })
    .forEach((w) => {
      const holeId = w.data('hole-id');
      const hole = findSvgElement(holeId, arduino);
      const holeX = hole.cx() + arduino.x();
      const holeY = hole.cy() + arduino.y();

      const connectionId = w.data('connection-id');
      const componentPin = findComponentConnection(element, connectionId);
      w.plot(holeX, holeY, componentPin.x, componentPin.y);
    });
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

export enum ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS {
  PIN_13 = 'pin2E',
  PIN_12 = 'pin6E',
  PIN_11 = 'pin9E',
  PIN_10 = 'pin13E',
  PIN_9 = 'pin18E',
  PIN_8 = 'pin22E',
  PIN_7 = 'pin27E',
  PIN_6 = 'pin31E',
  PIN_5 = 'pin37E',
  PIN_4 = 'pin41E',
  PIN_3 = 'pin46E',
  PIN_2 = 'pin51E',
  PIN_A0 = 'pin54E',
  PIN_A1 = 'pin58E',
  PIN_A2 = 'pin4F',
  PIN_A3 = 'pin8F',
  PIN_A4 = 'pin12F',
  PIN_A5 = 'pin16F',
}

export const pinToBreadboardHole = (pin: ARDUINO_UNO_PINS) => {
  switch (pin) {
    case ARDUINO_UNO_PINS.PIN_2:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_2;
    case ARDUINO_UNO_PINS.PIN_3:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_3;
    case ARDUINO_UNO_PINS.PIN_4:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_4;
    case ARDUINO_UNO_PINS.PIN_5:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_5;
    case ARDUINO_UNO_PINS.PIN_6:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_6;
    case ARDUINO_UNO_PINS.PIN_7:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_7;
    case ARDUINO_UNO_PINS.PIN_8:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_8;
    case ARDUINO_UNO_PINS.PIN_9:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_9;
    case ARDUINO_UNO_PINS.PIN_10:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_10;
    case ARDUINO_UNO_PINS.PIN_11:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_11;
    case ARDUINO_UNO_PINS.PIN_12:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_12;
    case ARDUINO_UNO_PINS.PIN_13:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_13;
    case ARDUINO_UNO_PINS.PIN_A0:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_A0;
    case ARDUINO_UNO_PINS.PIN_A1:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_A1;
    case ARDUINO_UNO_PINS.PIN_A2:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_A2;
    case ARDUINO_UNO_PINS.PIN_A3:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_A3;
    case ARDUINO_UNO_PINS.PIN_A4:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_A4;
    case ARDUINO_UNO_PINS.PIN_A5:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_A5;
    default:
      return ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_2;
  }
};

export const findBreadboardHoleXY = (
  pin: ARDUINO_UNO_PINS,
  arduino: Element,
  draw: Svg
) => {
  const hole = findSvgElement(pinToBreadboardHole(pin), draw);
  return {
    x: hole.cx() + arduino.x(),
    y: hole.cy() + arduino.y(),
  };
};

export const findResistorBreadboardHoleXY = (
  pin: ARDUINO_UNO_PINS,
  arduino: Element,
  draw: Svg
) => {
  const hole = findSvgElement(
    pinToBreadboardHole(pin).replace('E', 'D').replace('F', 'I'),
    draw
  );
  (window as any).hole = hole;
  return {
    x: hole.cx() + arduino.x(),
    y: (hole.findOne('circle') as Element).cy() + arduino.y() - 1,
  };
};
