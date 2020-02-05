import { getBlocksByName } from '../helpers/workspace';
// Changes the text on the for loop block to adding or subtracting
// Depending on whether the from is greater than to.
const forLoopChangeText = () => {
    getBlocksByName('controls_for').forEach((forBlock) => {
        const toNumber = getInputValue(forBlock, 'TO');
        const fromNumber = getInputValue(forBlock, 'FROM');
        const addText = toNumber > fromNumber ? 'by adding' : 'by subtracting';
        forBlock.inputList[2].fieldRow[0].setValue(addText);
    });
};
// TODO replace with real getInputValue function
const getInputValue = (block, inputName) => {
    const inputBlock = block.getInputTargetBlock(inputName);
    if (!inputBlock) {
        return 1; // assumming one is the defualt value
    }
    return inputBlock.getFieldValue('NUM');
};
export default forLoopChangeText;
