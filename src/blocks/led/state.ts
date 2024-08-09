import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface LedState extends ArduinoComponentState {
  pin: ARDUINO_PINS;
  state: number;
  fade: boolean;
  color: string;
}
