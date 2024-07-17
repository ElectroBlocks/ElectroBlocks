import {
  ArduinoComponentState,
  DraggableOption,
} from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface DigitilDisplayState
  extends ArduinoComponentState,
    DraggableOption {
  dioPin: ARDUINO_PINS;
  clkPin: ARDUINO_PINS;
  componentType: "SINGLE" | "MULTIPLE";
  chars: string;
  colonOn: boolean;
}
