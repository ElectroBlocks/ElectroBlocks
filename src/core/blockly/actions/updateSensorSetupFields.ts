import type { BlockEvent } from "../dto/event.type";
import { UpdateSetupSensorBlockFields, ActionType } from "./actions";
import _ from "lodash";
import { BlockType } from "../dto/block.type";

export const updateSensorSetupFields = (
  event: BlockEvent
): UpdateSetupSensorBlockFields[] => {
  const { fieldName, fieldType, newValue, oldValue, blockId, blocks } = event;

  // Are the right fields in the event
  if (!fieldName || !fieldType || !newValue || !oldValue) {
    return [];
  }

  // Is the event about changing the loop drop down field on the block
  if (!(fieldType === "field" && fieldName === "LOOP")) {
    return [];
  }

  const blockData = blocks.find((block) => block.id === blockId);

  // Is the block a sensor only block
  if (!blockData || blockData.type !== BlockType.SENSOR_SETUP) {
    return [];
  }

  // Does the block have the metadata necessary to update itself
  if (_.isEmpty(blockData.metaData)) {
    return [];
  }

  const newLoopValue = +newValue;
  const sensorData = JSON.parse(blockData.metaData).find(
    (data) => data.loop === newLoopValue
  );
  const fields = _.keys(sensorData)
    .filter((field) => field !== "loop")
    .map((fieldName) => {
      return {
        name: fieldName,
        value: sensorData[fieldName],
      };
    });
  
  return [
    {
      blockId: blockData.id,
      fields,
      type: ActionType.SETUP_SENSOR_BLOCK_FIELD_UPDATE,
    },
  ];
};
