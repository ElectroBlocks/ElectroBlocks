import { Sensor } from "../../core/blockly/dto/sensors.type";
import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface DigitalSensorState extends ArduinoComponentState {
  pin: ARDUINO_PINS;
  pictureType: DigitalPictureType;
  isOn: boolean;
}

export interface DigitalSensor extends Sensor {
  isOn: boolean;
}

export enum DigitalPictureType {
  SENSOR = "SENSOR",
  TOUCH_SENSOR = "TOUCH_SENSOR",
}
