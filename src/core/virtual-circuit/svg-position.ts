import { findSvgElement } from "./svg-helpers";
import { Element, Svg } from "@svgdotjs/svg.js";
import { ARDUINO_PINS } from "../microcontroller/selectBoard";
import { MicroController } from "../microcontroller/microcontroller";

export const positionComponent = (
  element: Element,
  arduino: Element,
  draw: Svg,
  wire: ARDUINO_PINS,
  connectionId: string,
  board: MicroController
) => {
  // 1 Take the Arduino X position
  // 2 Add to it the hole's x position
  // 3 minus the center of the pin in the virtual component
  element.x(
    arduino.x() +
      findSvgElement(board.pinToBreadboardHole(wire), draw).cx() -
      findSvgElement(connectionId, element).cx()
  );

  element.y(
    arduino.y() +
      findSvgElement("breadboard", arduino).y() -
      5 -
      element.height()
  );
};
