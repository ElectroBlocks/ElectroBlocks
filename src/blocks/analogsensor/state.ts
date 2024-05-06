import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface AnalogSensorState extends ArduinoComponentState {
  pins: ARDUINO_PINS[];
  pin: ARDUINO_PINS;
  state: number;
  pictureType: AnalogSensorPicture;
}

export interface AnalogSensor extends Sensor {
  state: number;
}

export enum AnalogSensorPicture {
  SENSOR = "SENSOR",
  PHOTO_SENSOR = "PHOTO_SENSOR",
  SOIL_SENSOR = "SOIL_SENSOR",
  POTENTIOMETER = "POTENTIOMETER",
}
