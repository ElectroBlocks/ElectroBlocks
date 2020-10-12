import { Sensor } from "../../core/blockly/dto/sensors.type";
import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface BluetoothState extends ArduinoComponentState {
  rxPin: ARDUINO_PINS;
  txPin: ARDUINO_PINS;
  hasMessage: boolean;
  message: string;
  sendMessage: string;
}

export interface BluetoothSensor extends Sensor {
  receiving_message: boolean;
  message: string;
}
