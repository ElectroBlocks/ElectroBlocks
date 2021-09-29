import type { MicroControllerBlocks } from './microcontroller';
import { MicroControllerType } from './microcontroller';
import unoArduino from '../../microcontrollers/arduino_uno/profile';
import { transformBoardBlockly } from './microcontroller.helpers';
import { getBoardType } from '../blockly/helpers/get-board.helper';
import arduinoMega from '../../microcontrollers/arduino_mega/profile';

export const getBoard = (type: MicroControllerType) => {
  return boardProfiles[type] || boardProfiles[MicroControllerType.ARDUINO_UNO];
};

export const selectBoardBlockly = (): MicroControllerBlocks => {
  const boardType = getBoardType();
  return transformBoardBlockly(boardProfiles[boardType]);
};

const boardProfiles = {
  uno: unoArduino,
  mega: arduinoMega,
};

export enum ARDUINO_PINS {
  PIN_1 = '1',
  PIN_2 = '2',
  PIN_3 = '3',
  PIN_4 = '4',
  PIN_5 = '5',
  PIN_6 = '6',
  PIN_7 = '7',
  PIN_8 = '8',
  PIN_9 = '9',
  PIN_10 = '10',
  PIN_11 = '11',
  PIN_12 = '12',
  PIN_13 = '13',
  PIN_14 = '14',
  PIN_15 = '15',
  PIN_16 = '16',
  PIN_17 = '17',
  PIN_18 = '18',
  PIN_19 = '19',
  PIN_20 = '20',
  PIN_21 = '21',
  PIN_22 = '22',
  PIN_23 = '23',
  PIN_24 = '24',
  PIN_25 = '25',
  PIN_26 = '26',
  PIN_27 = '27',
  PIN_28 = '28',
  PIN_29 = '29',
  PIN_30 = '30',
  PIN_31 = '31',
  PIN_32 = '32',
  PIN_33 = '33',
  PIN_34 = '34',
  PIN_35 = '35',
  PIN_36 = '36',
  PIN_37 = '37',
  PIN_38 = '38',
  PIN_39 = '39',
  PIN_40 = '40',
  PIN_41 = '41',
  PIN_42 = '42',
  PIN_43 = '43',
  PIN_44 = '44',
  PIN_45 = '45',
  PIN_46 = '46',
  PIN_47 = '47',
  PIN_48 = '48',
  PIN_49 = '49',
  PIN_50 = '50',
  PIN_51 = '51',
  PIN_52 = '52',
  PIN_53 = '53',
  PIN_54 = '54',
  PIN_A0 = 'A0',
  PIN_A1 = 'A1',
  PIN_A2 = 'A2',
  PIN_A3 = 'A3',
  PIN_A4 = 'A4',
  PIN_A5 = 'A5',
  PIN_A6 = 'A6',
  PIN_A7 = 'A7',
  PIN_A8 = 'A8',
  PIN_A9 = 'A9',
  PIN_A10 = 'A10',
  PIN_A11 = 'A11',
  PIN_A12 = 'A12',
  PIN_A13 = 'A13',
  PIN_A14 = 'A14',
  PIN_A15 = 'A15',
  NO_PINS = 'NO_PINS',
}

export const ANALOG_PINS = [
  ARDUINO_PINS.PIN_A0,
  ARDUINO_PINS.PIN_A1,
  ARDUINO_PINS.PIN_A2,
  ARDUINO_PINS.PIN_A3,
  ARDUINO_PINS.PIN_A4,
  ARDUINO_PINS.PIN_A5,
];
