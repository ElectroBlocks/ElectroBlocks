import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface TimeSensor extends Sensor {
  time_in_seconds: number;
}

export interface TimeState extends ArduinoComponentState {
  timeInSeconds: number;
}
