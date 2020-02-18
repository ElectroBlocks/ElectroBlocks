import { BlockEvent } from '../../../state/event.data';
import { DisableBlock, ActionType } from '../../actions';
import { BlockTypeRequireRootBlock } from '../../../state/block.data';

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
          blocks.find((b) => block.rootBlockId).type
        )
    )
    .map((block) => {
      return {
        blockId: block.id,
        type: ActionType.DISABLE_BLOCK,
        warningText: null
      };
    });
};
