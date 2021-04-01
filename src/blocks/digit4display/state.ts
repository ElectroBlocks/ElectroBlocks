import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface DigitilDisplayState extends ArduinoComponentState {
  dioPin: ARDUINO_PINS;
  clkPin: ARDUINO_PINS;
  chars: string;
  colonOn: boolean;
}
