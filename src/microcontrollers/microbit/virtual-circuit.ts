import { Element, Svg } from "@svgdotjs/svg.js";
import {
  AfterBoardReset,
  AfterCreateBoard,
} from "../../core/microcontroller/microcontroller.virtual-circuit-interfaces";

export const afterCreateMicrobit: AfterCreateBoard = (board, draw) => {
  const oldWith = board.width();
  const oldHeight = board.height();
  // we want some padding
  const newWidth = draw.viewbox().width - 20;
  const newHeight = (oldHeight / oldWith) * newWidth;
  board.width(newWidth);
  board.height(newHeight);
  const newY = draw.viewbox().height - newHeight - 20; // 20 for the zoom buttons
  board.y(newY);
  board.x(5); // so it so close to the edge

  afterResetMicrobit(board, draw);
};

export const afterResetMicrobit: AfterBoardReset = (board) => {
  board.findOne("#FINGER_A").hide();
  board.findOne("#FINGER_B").hide();
  for (let i = 1; i <= 25; i += 1) {
    board.findOne(`#MICROBIT_LED_${i}`).hide();
  }
};
