import { getAllBlocks } from '../block.helper';
import { standAloneBlocks, DisableBlock } from '../block.contants';

export const blockRequireToBeInSetupLoopOrFunction = (): DisableBlock[] => {
  return getAllBlocks()
    .filter((block) => !standAloneBlocks.includes(block.type))
    .filter(
      (block) =>
        !['arduino_loop', 'arduino_setup', 'procedures_defnoreturn'].includes(
          block.getRootBlock().type
        )
    )
    .map((block) => {
      return {
        blockId: block.id,
        warningText: null
      };
    });
};
