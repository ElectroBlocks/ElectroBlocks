import { BlockEvent } from '../../../state/event.data';
import { DisableBlock, ActionType } from '../../actions';
import { BlockType, multipleTopBlocks } from '../../../state/block.data';

export const disableDuplicateSetupBlocks = (
  event: BlockEvent
): DisableBlock[] => {
  const { blocks } = event;
  return blocks
    .filter((b) => [BlockType.SETUP, BlockType.SENSOR_SETUP].includes(b.type))
    .filter((b) => !multipleTopBlocks.includes(b.blockName))
    .filter(
      (b) => blocks.filter((bl) => bl.blockName === b.blockName).length > 0
    )
    .map((block) => {
      return {
        blockId: block.id,
        type: ActionType.DISABLE_BLOCK,
        warningText: 'Duplicate setup blocks, please remove one'
      };
    });
};
