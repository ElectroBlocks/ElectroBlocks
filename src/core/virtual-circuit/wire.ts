import {
  findBreadboardHoleXY,
  findComponentConnection,
  pinToBreadboardHole,
} from './svg-helpers';
import { Svg, Element, Line } from '@svgdotjs/svg.js';
import { ARDUINO_UNO_PINS } from '../../constants/arduino';

export interface Wire {
  id: string;
  pointBreadboardId: string;
  pointComponentId: string;
}

export const createWire = (
  element: Element,
  pin: ARDUINO_UNO_PINS,
  connectionId: string,
  arduino: Element,
  draw: Svg,
  color: string,
  componentId: string
) => {
  const hole = findBreadboardHoleXY(pin, arduino, draw);
  const componentPin = findComponentConnection(element, connectionId);
  const line = draw
    .line()
    .plot(hole.x, hole.y, componentPin.x, componentPin.y)
    .stroke({ width: 2, color: color, linecap: 'round' });
  line.data('component-id', componentId);
};

export const updateWire = (
  element: Element,
  pin: ARDUINO_UNO_PINS,
  connectionId: string,
  arduino: Element,
  draw: Svg,
  line: Line
) => {
  const hole = findBreadboardHoleXY(pin, arduino, draw);
  const componentPin = findComponentConnection(element, connectionId);

  line.plot(hole.x, hole.y, componentPin.x, componentPin.y);
};
