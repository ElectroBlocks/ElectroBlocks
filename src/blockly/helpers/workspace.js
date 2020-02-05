import Blockly from 'blockly';
const getWorkspace = () => {
    return Blockly.getMainWorkspace();
};
export const resizeWorkspace = () => {
    Blockly.svgResize(getWorkspace());
};
export const updateToolbox = (toolbox) => {
    return getWorkspace().updateToolbox(toolbox);
};
/**
 * Gets first block with name of the block
 */
export const getBlockByName = (name) => {
    return getWorkspace()
        .getAllBlocks(true)
        .find((block) => block.type === name);
};
export const getBlocksByName = (name) => {
    return getWorkspace()
        .getAllBlocks(true)
        .filter((block) => block.type === name);
};
export const deleteVariable = (id) => {
    getWorkspace().deleteVariableById(id);
};
export const getAllVariables = () => {
    return getWorkspace().getAllVariables();
};
export const isVariableBeingUsed = (id) => {
    return getWorkspace().getVariableUsesById(id).length > 0;
};
export const getVariableByName = (variableName) => {
    const variable = getWorkspace()
        .getAllVariables()
        .find((variable) => variable.name === variableName);
    return variable;
};
export const createBlock = (name, x, y, deletable = false) => {
    const block = getWorkspace().newBlock(name);
    block.setDeletable(deletable);
    block.initSvg();
    block.render();
    block.moveBy(x, y);
    return block;
};
