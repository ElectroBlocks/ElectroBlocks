import { BlockEvent } from '../../../state/event.data';
import { DisableBlock, ActionType } from '../../actions';
import {
  multipleTopBlocks,
  blocksThatRequireSetup,
  setupBlockTypeToHumanName,
  BlockData
} from '../../../state/block.data';
import _ from 'lodash';

export const disableBlocksThatNeedASetupBlock = (
  event: BlockEvent
): DisableBlock[] => {
  const { blocks } = event;

  return blocks
    .filter((b) => _.keys(blocksThatRequireSetup).includes(b.blockName))
    .filter((block) => shouldDisableBlock(block, blocks))
    .map((b) => {
      return {
        blockId: b.id,
        type: ActionType.DISABLE_BLOCK,
        warningText: `This block requires a ${
          setupBlockTypeToHumanName[blocksThatRequireSetup[b.blockName]]
        }.`
      };
    });
};

const shouldDisableBlock = (block: BlockData, blocks: BlockData[]): boolean => {
  const nameOfSetupBlock = blocksThatRequireSetup[block.blockName];

  const numberOfSetupBlocks = blocks.filter(
    (b) => !b.disabled && b.blockName === nameOfSetupBlock
  ).length;

  if (numberOfSetupBlocks == 1) {
    return false;
  }

  // If no setup blocks are found we need disable the block
  if (numberOfSetupBlocks < 1) {
    return true;
  }

  // If the user has more that one setup block than it must be marked as multiple allowed
  return !multipleTopBlocks.includes(nameOfSetupBlock)

};
