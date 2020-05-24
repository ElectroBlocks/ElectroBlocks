import { findSvgElement } from './svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { ARDUINO_UNO_PINS } from '../../constants/arduino';
import { pinToBreadboardHole } from './wire';

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