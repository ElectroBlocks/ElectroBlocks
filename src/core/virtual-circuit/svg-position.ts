import { findSvgElement } from "./svg-helpers";
import type { Element, Svg } from "@svgdotjs/svg.js";

export const positionComponent = (
  element: Element,
  arduino: Element,
  draw: Svg,
  connectionId: string,
  hole: number = null,
  isDown: boolean = null,
) => {
  // 1 Take the Arduino X position
  // 2 Add to it the hole's x position
  // 3 minus the center of the pin in the virtual component
  const holeId = hole ? `pin${hole}${isDown ? "E" : "F"}` : null;
  const holePosition = holeId ? findSvgElement(holeId, draw).cx() : 0;
  element.x(
    arduino.x() +
      holePosition -
      findSvgElement(connectionId, element).cx()
  );

  const breadboard = findSvgElement("breadboard", arduino);
  const breadboardPosition = breadboard ? breadboard.y() : 0;

  element.y(
    arduino.y() +
      breadboardPosition -
      5 -
      element.height()
  );
};
