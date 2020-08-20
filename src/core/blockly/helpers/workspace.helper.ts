import Blockly, { WorkspaceSvg, BlockSvg } from 'blockly';

export const getWorkspace = () => {
  return Blockly.getMainWorkspace() as WorkspaceSvg;
};

export const resizeWorkspace = () => {
  Blockly.svgResize(getWorkspace());
};

export const updateToolbox = (toolbox: string) => {
  return getWorkspace().updateToolbox(toolbox);
};

export const getArduinoCode = () => {
  return Blockly['Arduino'].workspaceToCode(getWorkspace()) as string;
};