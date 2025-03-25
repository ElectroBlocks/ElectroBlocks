import { MicrocontrollerType } from "../microcontroller/microcontroller";
import arduinoUnoSvg from "../../microcontrollers/arduino_uno/board.svg?raw";
import arduinoMegaSvg from "../../microcontrollers/arduino_mega/board.svg?raw";

export const getBoardSvg = (board: MicrocontrollerType) => {
  if (boardSvg[board]) {
    return boardSvg[board];
  }

  return arduinoUnoSvg;
};

const boardSvg = {
  [MicrocontrollerType.ARDUINO_UNO]: arduinoUnoSvg,
  [MicrocontrollerType.ARDUINO_MEGA]: arduinoMegaSvg,
};
