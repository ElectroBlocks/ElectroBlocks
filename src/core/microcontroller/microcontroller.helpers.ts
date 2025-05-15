import type { MicroController, MicroControllerBlocks } from "./microcontroller";

const pinArrayToFieldList = (pins: string[]): [string, string][] => {
  return pins.map((pin) => [pin, pin]);
};
export const transformBoardBlockly = (
  board: MicroController
): MicroControllerBlocks => {
  if (!board) {
    throw new Error("Board object is undefined");
  }

  return {
    serial_baud_rate: board.serial_baud_rate || 9600, // Default to 9600 if undefined
    type: board.type,
    pwmPins: pinArrayToFieldList(board.pwmPins || []),
    pwmNonAnalogPins: pinArrayToFieldList(board.pwmNonAnalogPins || []),
    digitalPins: pinArrayToFieldList(board.digitalPins || []),
    analogPins: pinArrayToFieldList(board.analonPins || []),
    sckPins: pinArrayToFieldList(board.sckPins || []),
    sclPins: pinArrayToFieldList(board.sclPins || []),
    sdaPins: pinArrayToFieldList(board.sdaPins || []),
    ssPins: pinArrayToFieldList(board.ssPins || []),
    misoPins: pinArrayToFieldList(board.misoPins || []),
    mosiPins: pinArrayToFieldList(board.mosiPins || []),
  };
};