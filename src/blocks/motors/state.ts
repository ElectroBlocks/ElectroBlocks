import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface MotorShieldState extends ArduinoComponentState {
  numberOfMotors: 1 | 2;
  speed1: number;
  direction1: MOTOR_DIRECTION;
  speed2: number;
  direction2: MOTOR_DIRECTION;
  en1: ARDUINO_PINS;
  in1: ARDUINO_PINS;
  in2: ARDUINO_PINS;
  in3: ARDUINO_PINS | null;
  in4: ARDUINO_PINS | null;
  en2: ARDUINO_PINS | null;
}

export enum MOTOR_DIRECTION {
  CLOCKWISE = "CLOCKWISE",
  ANTICLOCKWISE = "ANTI_CLOCKWISE",
}
