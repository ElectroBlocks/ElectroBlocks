import type { BlockEvent } from "../../dto/event.type";
import { type DisableBlock, ActionType } from "../actions";
import { BlockTypeRequireRootBlock } from "../../dto/block.type";

/**
 * Disables Blocks that are required to be in loop, setup, or prodecure function.
 */
export const disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction = (
  event: BlockEvent
): DisableBlock[] => {
  const { blocks } = event;
  return blocks
    .filter((block) => BlockTypeRequireRootBlock.includes(block.type))
    .filter(
      (block) =>
        block.rootBlockId === undefined ||
        BlockTypeRequireRootBlock.includes(
          blocks.find((b) => b.id === block.rootBlockId).type
        )
    )
    .map((block) => {
      return {
        blockId: block.id,
        type: ActionType.DISABLE_BLOCK,
        warningText: null,
        stopCompiling: false,
      };
    });
};
