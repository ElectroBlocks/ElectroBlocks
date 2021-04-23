import { Element } from "@svgdotjs/svg.js";
import {
  afterCreateMicrobit,
  afterResetMicrobit,
} from "../../microcontrollers/microbit/virtual-circuit";
import { MicroControllerType } from "./microcontroller";
import {
  AfterBoardReset,
  AfterCreateBoard,
} from "./microcontroller.virtual-circuit-interfaces";

const empty = (el: Element) => {};

export const microControllerAfterCreateHook: {
  [key: string]: AfterCreateBoard;
} = {
  [MicroControllerType.ARDUINO_MEGA]: empty,
  [MicroControllerType.ARDUINO_UNO]: empty,
  [MicroControllerType.MICROBIT]: afterCreateMicrobit,
};

export const microControllerAfterReset: {
  [key: string]: AfterBoardReset;
} = {
  [MicroControllerType.ARDUINO_MEGA]: empty,
  [MicroControllerType.ARDUINO_UNO]: empty,
  [MicroControllerType.MICROBIT]: afterResetMicrobit,
};
