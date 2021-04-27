import { AfterCreateBoard } from "../../core/microcontroller/microcontroller.virtual-circuit-interfaces";

export const afterCreateMega: AfterCreateBoard = (arduino, draw) => {
  const zoomWidth = draw.width() / arduino.width();
  const minusAmount = draw.height() - 300 > 200 ? 250 : 150;
  const zoomHeight = (draw.height() - minusAmount) / arduino.height();
  (draw as any).zoom((zoomHeight < zoomWidth ? zoomHeight : zoomWidth) - 0.1); // ZOOM MUST GO FIRST TO GET THE RIGHT X Y VALUES IN POSITIONING.
  // Minus .1 is so that lcd screen and other things fit in.
  arduino.y(draw.viewbox().y2 - arduino.height() + 30);
  arduino.x(-30);
};
