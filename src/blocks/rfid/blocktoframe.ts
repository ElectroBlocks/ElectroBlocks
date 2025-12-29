import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { RFIDSensor, RfidState } from "./state";

export const rfidSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorData = JSON.parse(block.metaData) as RFIDSensor[];

  const rfidSensorLoop1 = sensorData.find((s) => s.loop === 1) as RFIDSensor;
  const txPin = findFieldValue(block, "PIN_TX");
  const rxPin = findFieldValue(block, "PIN_RX");
  const rfidComponent: RfidState = {
    pins: block.pins,
    type: ArduinoComponentType.RFID,
    txPin,
    rxPin,
    scannedCard: rfidSensorLoop1.scanned_card,
    tag: rfidSensorLoop1.tag,
    setupCommand: `register::rfi::${rxPin}::${txPin}::9600`,
    enableFlag: "ENABLE_RFID_UART",
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      rfidComponent,
      "Setting up RFID.",
      previousState
    ),
  ];
};
