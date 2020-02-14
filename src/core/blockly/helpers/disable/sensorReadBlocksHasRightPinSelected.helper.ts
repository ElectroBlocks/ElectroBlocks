import { getAllBlocks } from '../block.helper';
import { DisableBlock } from '../block.contants';

export const sensorReadBlocksHasRightPinSelected = (
  sensorReadBlockTypes: string[],
  setupBlockType: string
): DisableBlock[] => {
  const allBlocks = getAllBlocks();
  const sensorReadBlocks = allBlocks.filter((block) =>
    sensorReadBlockTypes.includes(block.type)
  );

  const availablePins = allBlocks
    .filter((block) => block.type === setupBlockType)
    .map((block) => block.getFieldValue('PIN'));

  if (availablePins.length === 0) {
    return [];
  }
  return sensorReadBlocks
    .filter((block) => !availablePins.includes(block.getFieldValue('PIN')))
    .map((block) => {
      const pinNumber = block.getFieldValue('pin');
      const warningText = pinNumber
        ? `No setup found for pin ${pinNumber}`
        : `No setup block found.`;
      return {
        blockId: block.id,
        warningText
      };
    });
};
