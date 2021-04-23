import {
  AfterBoardReset,
  AfterCreateBoard,
} from "../../core/microcontroller/microcontroller.virtual-circuit-interfaces";

export const afterCreateMicrobit: AfterCreateBoard = (board) => {
  board.x(0);
  board.y(30);
  board.findOne("#layer4").hide();
  board.findOne("#layer5").hide();
};

export const afterResetMicrobit: AfterBoardReset = (board) => {
  board.findOne("#layer4").hide();
  board.findOne("#layer5").hide();
};
