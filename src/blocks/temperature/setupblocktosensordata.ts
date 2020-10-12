import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { TempSensor } from "./state";

export const temperatureSetupBlockToSensorData = (
  block: BlockData
): TempSensor => {
  return {
    temp: +findFieldValue(block, "temp"),
    humidity: +findFieldValue(block, "humidity"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
