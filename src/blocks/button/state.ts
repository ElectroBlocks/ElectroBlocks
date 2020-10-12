import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface ButtonSensor extends Sensor {
  is_pressed: boolean;
}

export interface ButtonState extends ArduinoComponentState {
  isPressed: boolean;
}
