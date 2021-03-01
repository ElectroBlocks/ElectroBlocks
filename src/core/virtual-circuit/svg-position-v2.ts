import { findSvgElement } from "./svg-helpers";
import type { Element, Svg } from "@svgdotjs/svg.js";

export const positionComponent = (
  element: Element,
  arduino: Element,
  draw: Svg,
  hole: number,
  isDown: boolean,
  connectionId: string
) => {
  // 1 Take the Arduino X position
  // 2 Add to it the hole's x position
  // 3 minus the center of the pin in the virtual component
  const holeId = `pin${hole}${isDown ? "E" : "F"}`;
  element.x(
    arduino.x() +
      findSvgElement(holeId, draw).cx() -
      findSvgElement(connectionId, element).cx()
  );

  element.y(
    arduino.y() +
      findSvgElement("breadboard", arduino).y() -
      5 -
      element.height()
  );
};
