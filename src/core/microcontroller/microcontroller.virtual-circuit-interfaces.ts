import { Element } from "@svgdotjs/svg.js";

export interface AfterCreateBoard {
  (microcontrollerEl: Element): void;
}

export interface AfterBoardReset {
  (microcontroller: Element): void;
}
