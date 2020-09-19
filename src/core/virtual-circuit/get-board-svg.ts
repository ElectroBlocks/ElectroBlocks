import { MicroControllerType } from "../microcontroller/microcontroller";
import arduinoUnoSvg from "./svgs/boards/arduino_uno.svg";
import arduinoMegaSvg from "./svgs/boards/arduino_mega.svg";

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
