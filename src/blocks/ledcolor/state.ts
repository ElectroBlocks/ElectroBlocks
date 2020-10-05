import { ArduinoComponentState, Color } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface LedColorState extends ArduinoComponentState {
  redPin: ARDUINO_PINS;
  greenPin: ARDUINO_PINS;
  bluePin: ARDUINO_PINS;
  pictureType: "BUILT_IN" | "BREADBOARD";
  color: Color;
}
