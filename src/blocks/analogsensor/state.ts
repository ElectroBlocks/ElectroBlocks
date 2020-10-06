import { Sensor } from "../../core/blockly/dto/sensors.type";
import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

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
  TOUCH_SENSOR = "TOUCH_SENSOR",
}
