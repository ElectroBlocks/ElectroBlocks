import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface LCDScreenState extends ArduinoComponentState {
  rows: number;
  columns: number;
  memoryType: LCD_SCREEN_MEMORY_TYPE;
  rowsOfText: string[];
  blink: { row: number; column: number; blinking: boolean };
  backLightOn: boolean;
  sdaPin: ARDUINO_PINS;
  sclPin: ARDUINO_PINS;
}

export enum LCD_SCREEN_MEMORY_TYPE {
  "OX3F" = "0x3F",
  "0X27" = "0x27",
}
