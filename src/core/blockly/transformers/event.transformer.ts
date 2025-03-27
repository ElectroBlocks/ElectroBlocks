import type { BlockSvg, VariableModel } from "blockly";
import { transformBlock } from "./block.transformer";
import type { BlockEvent } from "../dto/event.type";
import _ from "lodash";
import { transformVariable } from "./variables.transformer";
import type { MicroControllerType } from "../../microcontroller/microcontroller";

export const transformEvent = (
  blocks: BlockSvg[],
  variables: VariableModel[],
  event: Object | any,
  microcontrollerType: MicroControllerType
): BlockEvent => {
  const blockDatum = blocks.map(transformBlock);
  return {
    blockId: _.get(event, "blockId", undefined),
    type: event.type,
    blocks: blockDatum,
    microController: microcontrollerType,
    variables: variables.map(transformVariable),
    fieldName: _.get(event, "name", undefined),
    fieldType: _.get(event, "element", undefined),
    newValue: _.get(event, "newValue", undefined),
    oldValue: _.get(event, "oldValue", undefined),
  };
};
