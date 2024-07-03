import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface MotorState extends ArduinoComponentState {
  motorNumber: string;
  speed: number;
  direction: MOTOR_DIRECTION;
  // pin: string;
}

export enum MOTOR_DIRECTION {
  CLOCKWISE = "CLOCKWISE",
  ANTICLOCKWISE = "ANTICLOCKWISE",
}

export interface MotionSensor extends Sensor {
  cm: number;
}
