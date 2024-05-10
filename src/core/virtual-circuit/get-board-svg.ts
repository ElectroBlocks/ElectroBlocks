import { MicroControllerType } from "../microcontroller/microcontroller";
import arduinoUnoSvg from "../../microcontrollers/arduino_uno/board.svg?raw";
import arduinoMegaSvg from "../../microcontrollers/arduino_mega/board.svg?raw";

export const getBoardSvg = (board: MicroControllerType) => {
  if (boardSvg[board]) {
    return boardSvg[board];
  }

  return arduinoUnoSvg;
};

const boardSvg = {
  [MicroControllerType.ARDUINO_UNO]: arduinoUnoSvg,
  [MicroControllerType.ARDUINO_MEGA]: arduinoMegaSvg,
};
