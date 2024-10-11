import { BlockEvent } from "../dto/event.type";
import { findFieldValue } from "../helpers/block-data.helper";
import { ActionType, UpdateSetAllFastLedBlock } from "./actions";

export const updateFastLedSetAllColorsUpdateBlock = (
  event: BlockEvent
): UpdateSetAllFastLedBlock[] => {
  const { blocks, blockId } = event;

  const block = blocks.find((block) => block.id === blockId);

  // If the block is not found it means it was deleted.
  if (!block) {
    return [];
  }

  if (!["fastled_set_all_colors", "fastled_setup"].includes(block.blockName)) {
    return [];
  }
  const fastLedSetup = blocks.find((b) => b.blockName == "fastled_setup");

  if (!fastLedSetup) {
    return [];
  }

  const maxLeds = +findFieldValue(fastLedSetup, "NUMBER_LEDS");
  const maxRows = Math.ceil(maxLeds / 12);
  const maxColumnsOnLastRow = maxLeds - (maxRows - 1) * 12;
  return blocks
    .filter((b) => b.blockName == "fastled_set_all_colors")
    .map((b) => {
      return {
        type: ActionType.UPDATE_FASTLED_SET_ALL_COLORS_BLOCK,
        maxLeds: maxLeds,
        blockId: b.id,
        maxRows,
        maxColumnsOnLastRow,
      };
    });
};
