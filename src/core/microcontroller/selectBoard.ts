import { MicroControllerBlocks, MicroController } from "./microcontroller";
import unoArduino from "./arduino_uno.board";
import { transformBoardBlockly } from "./microcontroller.helpers";
import { getBoardType } from "../blockly/helpers/get-board.helper";
import arduinoMega from "./arduino_mega.board";

export const selectedBoard = (): MicroController => {
  const boardType = getBoardType();

  return boardProfiles[boardType];
};

export const selectBoardBlockly = (): MicroControllerBlocks => {
  const boardType = getBoardType();

  return transformBoardBlockly(boardProfiles[boardType]);
};

const boardProfiles = {
  uno: unoArduino,
  mega: arduinoMega,
};

export enum ARDUINO_UNO_PINS {
  PIN_1 = "1",
  PIN_2 = "2",
  PIN_3 = "3",
  PIN_4 = "4",
  PIN_5 = "5",
  PIN_6 = "6",
  PIN_7 = "7",
  PIN_8 = "8",
  PIN_9 = "9",
  PIN_10 = "10",
  PIN_11 = "11",
  PIN_12 = "12",
  PIN_13 = "13",
  PIN_A0 = "A0",
  PIN_A1 = "A1",
  PIN_A2 = "A2",
  PIN_A3 = "A3",
  PIN_A4 = "A4",
  PIN_A5 = "A5",
  NO_PINS = "NO_PINS",
}

export const ANALOG_PINS = [
  ARDUINO_UNO_PINS.PIN_A0,
  ARDUINO_UNO_PINS.PIN_A1,
  ARDUINO_UNO_PINS.PIN_A2,
  ARDUINO_UNO_PINS.PIN_A3,
  ARDUINO_UNO_PINS.PIN_A4,
  ARDUINO_UNO_PINS.PIN_A5,
];
