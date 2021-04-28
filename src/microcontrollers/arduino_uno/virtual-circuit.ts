import { AfterCreateBoard } from "../../core/microcontroller/microcontroller.virtual-circuit-interfaces";

export const afterCreateUno: AfterCreateBoard = (arduino, draw) => {
  draw.viewbox(arduino.bbox());
  (draw as any).zoom((draw as any).zoom() - 0.15);
  // move it down 150 px
  arduino.dy(150);
};
