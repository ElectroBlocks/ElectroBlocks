import { BlockData } from '../state/block.data';

export const findFieldValue = (block: BlockData, fieldName: string) => {
  const field = block.fieldValues.find((f) => f.name === fieldName);
  return field ? field.value : undefined;
};

export const getLoopTimeFromBlockData = (blocks: BlockData[]): number => {
  return +blocks
    .find((block) => block.blockName == 'arduino_loop')
    .fieldValues.find((field) => field.name === 'LOOP_TIMES').value;
};
