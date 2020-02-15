import { getBlocksByName, isNumberBlock } from '../helpers/block.helper';
import { BlockSvg } from 'blockly';

// Changes the text on the for loop block to adding or subtracting
// Depending on whether the from is greater than to.
const forLoopChangeText = () => {
  const forLoopBlocks = getBlocksByName('controls_for');
  forLoopBlocks.forEach((forBlock) => {
    const toBlock = forBlock.getInputTargetBlock('TO') as BlockSvg;
    const fromBlock = forBlock.getInputTargetBlock('FROM') as BlockSvg;

    if (!isNumberBlock(fromBlock) || !isNumberBlock(toBlock)) {
      forBlock.inputList[2].fieldRow[0].setValue('by');
      return;
    }

    const toNumber = toBlock.getFieldValue('NUM') || 1;
    const fromNumber = fromBlock.getFieldValue('NUM') || 1;

    const addText = toNumber > fromNumber ? 'by adding' : 'by subtracting';

    forBlock.inputList[2].fieldRow[0].setValue(addText);
  });
};

export default forLoopChangeText;
