import { MicroControllerType } from "../microcontroller/microcontroller";
import arduinoUnoSvg from "../../microcontrollers/arduino_uno/board.svg";
import arduinoMegaSvg from "../../microcontrollers/arduino_mega/board.svg";

import microbitSvg from "../../microcontrollers/microbit/microbit.svg";

export const getBoardSvg = (board: MicroControllerType) => {
  if (boardSvg[board]) {
    return boardSvg[board];
  }

  return arduinoUnoSvg;
};

const boardSvg = {
  [MicroControllerType.ARDUINO_UNO]: arduinoUnoSvg,
  [MicroControllerType.ARDUINO_MEGA]: arduinoMegaSvg,
  [MicroControllerType.MICROBIT]: microbitSvg,
};
