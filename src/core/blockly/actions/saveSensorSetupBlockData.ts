import type { BlockEvent } from "../dto/event.type";
import { type SaveSetupSensorData, ActionType } from "./actions";
import { BlockType } from "../dto/block.type";
import _ from "lodash";
import { convertToSensorData } from "../transformers/sensor-data.transformer";
import {
  findFieldValue,
  getLoopTimeFromBlockData,
} from "../helpers/block-data.helper";

export const saveSensorSetupBlockData = (
  event: BlockEvent
): SaveSetupSensorData[] => {
  const { fieldName, blockId, blocks, fieldType } = event;  
  if (fieldName == "LOOP" && fieldType === "field") {
    return [];
  }

  const block = blocks.find((b) => b.id == blockId);

  // We want to block the time setup because it does not have a loop drop down and time should remain constant for each loop to
  // simplify the simulator.
  if (
    !block ||
    block.type !== BlockType.SENSOR_SETUP ||
    block.blockName === "time_setup"
  ) {
    return [];
  }

  const executionTimes = getLoopTimeFromBlockData(blocks);
  console.log({executionTimes});
  
  const loopTimes = _.range(1, executionTimes + 1);
  const sensorData = convertToSensorData(block);
  const copyAll = findFieldValue(block, "COPY_SAME") == "TRUE";
  if (!_.isEmpty(block.metaData) && !copyAll) {
    const metadata = JSON.parse(block.metaData);
    const nonBlankMetaData = loopTimes.map((loopIndex) => {
      const existingLoop = metadata.find((b) => b.loop === loopIndex);
      if (existingLoop) {
        return existingLoop;
      }
      return { ...sensorData, loop: loopIndex };
    });
    const newMetadata = [
      ...nonBlankMetaData.filter((b) => b.loop !== sensorData.loop),
      sensorData,
    ];
    return [
      {
        blockId: block.id,
        data: JSON.stringify(newMetadata),
        type: ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA,
      },
    ];
  }

  const metadata = loopTimes.map((i) => {
    return { ...sensorData, loop: i };
  });

  console.log({metadata});
  

  return [
    {
      blockId: block.id,
      data: JSON.stringify(metadata),
      type: ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA,
    },
  ];
};
