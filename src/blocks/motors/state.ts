import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface MotorState extends ArduinoComponentState {
  motorNumber: number;
  speed: number;
  direction: MOTOR_DIRECTION;
}

export enum MOTOR_DIRECTION {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export interface MotionSensor extends Sensor {
  cm: number;
}
