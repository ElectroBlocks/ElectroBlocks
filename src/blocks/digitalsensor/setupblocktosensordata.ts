import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { DigitalSensor } from "./state";

export const digitalSetupBlockToSensorData = (
  block: BlockData
): DigitalSensor => {
  return {
    isOn: findFieldValue(block, "isOn") === "TRUE",
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
