import type { MicroController, MicroControllerBlocks } from "./microcontroller";

const pinArrayToFieldList = (pins: string[]): [string, string][] => {
  return pins.map((pin) => [pin, pin]);
};

export const transformBoardBlockly = (
  board: MicroController
): MicroControllerBlocks => {
  return {
    serial_baud_rate: board.serial_baud_rate,
    type: board.type,
    pwmPins: pinArrayToFieldList(board.pwmPins),
    digitalPins: pinArrayToFieldList(board.digitalPins),
    analogPins: pinArrayToFieldList(board.analonPins),
    sckPins: pinArrayToFieldList(board.sckPins),
    sclPins: pinArrayToFieldList(board.sclPins),
    sdaPins: pinArrayToFieldList(board.sdaPins),
    ssPins: pinArrayToFieldList(board.ssPins),
    misoPins: pinArrayToFieldList(board.misoPins),
    mosiPins: pinArrayToFieldList(board.mosiPins),
  };
};
