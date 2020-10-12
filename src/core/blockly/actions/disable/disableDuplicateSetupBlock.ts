import type { BlockEvent } from "../../dto/event.type";
import { DisableBlock, ActionType } from "../actions";
import { BlockType, multipleTopBlocks } from "../../dto/block.type";

/**
 * Disables duplicate setup blocks.  Example 2 RFID Setup Blocks
 */
export const disableDuplicateSetupBlocks = (
  event: BlockEvent
): DisableBlock[] => {
  const { blocks } = event;
  return blocks
    .filter((b) => [BlockType.SETUP, BlockType.SENSOR_SETUP].includes(b.type))
    .filter((b) => !multipleTopBlocks.includes(b.blockName))
    .filter(
      (b) => blocks.filter((bl) => bl.blockName === b.blockName).length > 1
    )
    .map((block) => {
      return {
        blockId: block.id,
        type: ActionType.DISABLE_BLOCK,
        warningText: "Duplicate setup blocks, please remove one",
        stopCompiling: true,
      };
    });
};
