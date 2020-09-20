import { BlockData } from "../../../core/blockly/dto/block.type";
import { Sensor } from "../../../core/blockly/dto/sensors.type";
import { findFieldValue } from "../../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentState,
  ArduinoComponentType,
  Timeline,
} from "../../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../../core/microcontroller/selectBoard";

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

export const saveBluetoothDataInSetupBlock = (
  block: BlockData
): BluetoothSensor => {
  return {
    receiving_message: findFieldValue(block, "receiving_message") === "TRUE",
    message: findFieldValue(block, "message"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

export const setupBlockToBluetoothState = (
  block: BlockData,
  timeline: Timeline
): BluetoothState => {
  const btState = findSensorState<BluetoothSensor>(block, timeline);

  return {
    type: ArduinoComponentType.BLUE_TOOTH,
    rxPin: findFieldValue(block, "PIN_RX") as ARDUINO_PINS,
    txPin: findFieldValue(block, "PIN_TX") as ARDUINO_PINS,
    pins: [
      findFieldValue(block, "PIN_TX") as ARDUINO_PINS,
      findFieldValue(block, "PIN_RX") as ARDUINO_PINS,
    ],
    hasMessage: btState.receiving_message,
    message: btState.message,
    sendMessage: "",
  };
};
