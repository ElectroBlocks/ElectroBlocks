import { getAllBlocks } from '../block.helper';
import { DisableBlock, standAloneBlocks, blockMultipleSetup } from '../block.contants';

export const duplicateSetupBlocks = (): DisableBlock[] => {
  const blocks = getAllBlocks();
  return blocks
    .filter((setupBlock) => standAloneBlocks.includes(setupBlock.type))
    .filter((setupBlock) => !blockMultipleSetup.includes(setupBlock.type))
    .filter(
      (block) => block.type !== 'arduino_loop' && block.type !== 'arduino_setup'
    )
    .filter(
      (setupBlock) =>
        blocks.filter((block) => block.type === setupBlock.type).length > 1
    )
    .map((setupBlockDuplicate) => {
      return {
        blockId: setupBlockDuplicate.id,
        warningText: 'Duplicate setup blocks, please remove one.'
      };
    });
};
