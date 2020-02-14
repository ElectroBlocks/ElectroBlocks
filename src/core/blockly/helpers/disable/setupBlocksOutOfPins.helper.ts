import { getTopBlocks } from '../block.helper';
import { blockMultipleSetup, DisableBlock } from '../block.contants';

export const setupBlocksOutOfPins = (): DisableBlock[] => {
  return getTopBlocks()
    .filter((block) => blockMultipleSetup.includes(block.type))
    .filter((block) => block.type !== 'procedures_defnoreturn')
    .filter((block) => block.getFieldValue('PIN') === 'NO_PINS')
    .map((block) => {
      return {
        blockId: block.id,
        warningText: 'Arduino is out of pins'
      };
    });
};
