import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { RFIDSensor, RfidState } from "./state";

export const rfidSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): RfidState => {
  const rfidSensor = findSensorState<RFIDSensor>(block, timeline);
  const rxPin = findFieldValue(block, "PIN_RX");
  const txPin = findFieldValue(block, "PIN_TX");

  return {
    type: ArduinoComponentType.RFID,
    txPin,
    rxPin,
    pins: [rxPin, txPin],
    scannedCard: rfidSensor.scanned_card,
    tag: rfidSensor.tag,
    setupCommand: `register::rfi::${txPin}::${rxPin}::9600`,
    enableFlag: "ENABLE_RFID_UART",
  };
};

export const rfidStateStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
): RfidState => {
  const setupBlock = blocks.find((b) => b.blockName == "rfid_setup");
  const [_, pinState, state] = sensorStr.split(":");
  const rxPin = findFieldValue(setupBlock, "PIN_RX");
  const txPin = findFieldValue(setupBlock, "PIN_TX");
  return {
    type: ArduinoComponentType.RFID,
    txPin,
    rxPin,
    pins: [rxPin, txPin],
    scannedCard: state != "0",
    tag: state == "0" ? "" : state,
    setupCommand: `register::rfi::${txPin}::${rxPin}::9600`,
    enableFlag: "ENABLE_RFID_UART",
  };
};