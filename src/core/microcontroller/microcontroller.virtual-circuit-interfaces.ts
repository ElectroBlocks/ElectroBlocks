import { Element, Svg } from "@svgdotjs/svg.js";

export interface AfterCreateBoard {
  (microcontrollerEl: Element | Svg, draw: Svg): void;
}

export interface AfterBoardReset {
  (microcontroller: Element, draw: Svg): void;
}
