import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface LedState extends ArduinoComponentState {
  pin: ARDUINO_PINS;
  state: number;
  fade: boolean;
}
