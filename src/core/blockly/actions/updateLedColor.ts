import { BlockEvent } from "../dto/event.type";
import { findFieldValue } from "../helpers/block-data.helper";
import { ActionType, UpdateLedColor } from "./actions";

export const updateLedBlockColorField = (
  event: BlockEvent
): UpdateLedColor[] => {
  const { blocks, newValue, fieldName, blockId } = event;

  const block = blocks.find((block) => block.id === blockId);

  if (block.blockName != "led") {
    return [];
  }

  const ledBlocks = blocks.filter(
    (b) =>
      b.blockName == "led" && b.pins.includes(block.pins[0]) && b.id != blockId
  );

  return ledBlocks.map((b) => {
    return {
      blockId: b.id,
      color: findFieldValue(block, "COLOR") as string,
      type: ActionType.UPDATE_LED_COLOR,
    };
  });
};
