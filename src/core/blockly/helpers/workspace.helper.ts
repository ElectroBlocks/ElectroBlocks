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

export const showSetupBlockDebugView = (show: boolean) => {
  getWorkspace()
  .getAllBlocks(false)
  .filter(b => b.getInput('SHOW_CODE_VIEW'))
  .forEach(b => {
    const debugFieldIndex = b.inputList.findIndex(f => f.name === 'SHOW_CODE_VIEW');
    b.inputList.filter((f, i) => i >= debugFieldIndex).forEach(f => f.setVisible(show));
    (b as BlockSvg).render();
  })
}