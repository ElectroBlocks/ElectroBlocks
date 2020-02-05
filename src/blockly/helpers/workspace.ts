import Blockly, { WorkspaceSvg, BlockSvg } from 'blockly';

const getWorkspace = () => {
  return Blockly.getMainWorkspace() as WorkspaceSvg;
};

export const resizeWorkspace = () => {
  Blockly.svgResize(getWorkspace());
};

export const updateToolbox = (toolbox: string) => {
  return getWorkspace().updateToolbox(toolbox);
};

/**
 * Gets first block with name of the block
 */
export const getBlockByName = (name: string) => {
  return getWorkspace()
    .getAllBlocks(true)
    .find((block) => block.type === name) as BlockSvg;
};

export const getBlocksByName = (name: string) => {
  return getWorkspace()
    .getAllBlocks(true)
    .filter((block) => block.type === name) as BlockSvg[];
};

export const deleteVariable = (id: string) => {
  getWorkspace().deleteVariableById(id);
};

export const getAllVariables = () => {
  return getWorkspace().getAllVariables();
};

export const isVariableBeingUsed = (id: string) => {
  return getWorkspace().getVariableUsesById(id).length > 0;
};

export const getVariableByName = (variableName: string) => {
  const variable = getWorkspace()
    .getAllVariables()
    .find((variable) => variable.name === variableName);

  return variable;
};

export const createBlock = (
  name: string,
  x: number,
  y: number,
  deletable = false
) => {
  const block = getWorkspace().newBlock(name) as BlockSvg;
  block.setDeletable(deletable);
  block.initSvg();
  block.render();
  block.moveBy(x, y);

  return block;
};
