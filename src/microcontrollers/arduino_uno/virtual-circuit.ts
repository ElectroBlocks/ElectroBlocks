import { Matrix } from "@svgdotjs/svg.js";
import { AfterCreateBoard } from "../../core/microcontroller/microcontroller.virtual-circuit-interfaces";

export const afterCreateUno: AfterCreateBoard = (arduino, draw) => {
  draw.viewbox(arduino.bbox());
  (draw as any).zoom((draw as any).zoom() - 0.15);
  arduino.y((draw as any).zoom() * 220);
};
