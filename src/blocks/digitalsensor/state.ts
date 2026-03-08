import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface DigitalSensorState extends ArduinoComponentState {
  pin: ARDUINO_PINS;
  sensorType: DigitalSensorType;
  isOn: boolean;
}

export interface DigitalSensor extends Sensor {
  isOn: boolean;
}

export enum DigitalSensorType {
  SENSOR = "SENSOR",
  TOUCH_SENSOR = "TOUCH_SENSOR",
  IR_SENSOR = "IR_SENSOR"
}
