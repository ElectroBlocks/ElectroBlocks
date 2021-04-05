import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface JoystickState extends ArduinoComponentState {
  xPin: ARDUINO_PINS;
  yPin: ARDUINO_PINS;
  buttonPin: ARDUINO_PINS;
  degree: number;
  buttonPressed: boolean;
  engaged: boolean;
}
