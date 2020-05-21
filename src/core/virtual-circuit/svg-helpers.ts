import {
  ArduinoComponentType,
  ArduinoComponentState,
} from '../frames/state/arduino.state';
import { Element, Svg } from '@svgdotjs/svg.js';
import { ARDUINO_UNO_PINS } from '../../constants/arduino';

export const componentToSvgId = (component: ArduinoComponentState) => {
  return component.type + '_' + component.pins.join('-');
};

export const positionComponent = (
  element: Element,
  arduino: Element,
  draw: Svg,
  wire: ARDUINO_UNO_PINS,
  connectionId: string
) => {
  // 1 Take the Arduino X position
  // 2 Add to it the hole's x position
  // 3 minus the center of the pin in the virtual component

  element.x(
    arduino.x() +
      findSvgElement(pinToBreadboardHole(wire), draw).cx() -
      findSvgElement(connectionId, element).cx()
  );

  element.y(
    arduino.y() +
      findSvgElement('breadboard', arduino).y() -
      5 -
      element.height()
  );
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

export const findComponentConnection = (
  element: Element,
  connectionId: string
) => {
  const connection = findSvgElement(connectionId, element);
  return {
    x: connection.cx() + element.x(),
    y: connection.y() + connection.height() + element.y(),
  };
};

export const findSvgElement = (
  id: string,
  draw: Svg | Element
): Svg | Element => {
  return draw.findOne('#' + id) as Svg | Element;
};

export enum ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS {
  PIN_13 = 'pin2C',
  PIN_12 = 'pin6C',
  PIN_11 = 'pin9C',
  PIN_10 = 'pin13C',
  PIN_9 = 'pin18C',
  PIN_8 = 'pin22C',
  PIN_7 = 'pin27C',
  PIN_6 = 'pin31C',
  PIN_5 = 'pin37C',
  PIN_4 = 'pin41C',
  PIN_3 = 'pin46C',
  PIN_2 = 'pin51C',
  PIN_A0 = 'pin54C',
  PIN_A1 = 'pin58C',
  PIN_A2 = 'pin4H',
  PIN_A3 = 'pin8H',
  PIN_A4 = 'pin12H',
  PIN_A5 = 'pin16H',
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
