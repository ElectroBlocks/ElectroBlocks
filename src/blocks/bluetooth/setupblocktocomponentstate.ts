import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { BluetoothSensor, BluetoothState } from "./state";

export const bluetoothSetupBlockToComponentState = (
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
