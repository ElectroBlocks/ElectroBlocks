import { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { DigitalSensor } from "./state";

export const digitalSetupBlockToSensorData = (
  block: BlockData
): DigitalSensor => {
  return {
    isOn: findFieldValue(block, "state") === "TRUE",
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
