import type { WorkspaceSvg } from 'blockly';
import Blockly from 'blockly';
import { arduinoLoopBlockShowLoopForeverText } from "./arduino_loop_block.helper";
import { getAllBlocks } from "./block.helper";

export const getWorkspace = () => {
  return Blockly.getMainWorkspace() as WorkspaceSvg;
};

export const resizeWorkspace = () => {
  Blockly.svgResize(getWorkspace());
};

export const updateToolbox = (toolbox: string) => {
  if (getWorkspace()) {
    return getWorkspace().updateToolbox(toolbox);
  }
};

export const getArduinoCode = () => {
  return Blockly['Arduino'].workspaceToCode(getWorkspace()) as string;
};

export const workspaceToXML = () => {
  const xml = Blockly.Xml.workspaceToDom(getWorkspace());
  return Blockly.Xml.domToText(xml);
}

export const loadProject = (xmlString: string) => {
  const blocksToDelete = getAllBlocks(); // get a list of all the old blocks
  const xml = Blockly.Xml.textToDom(xmlString); 
  Blockly.Xml.domToWorkspace(xml, getWorkspace()); // load new blocks
  blocksToDelete.forEach((b) => b.dispose(true)); // delete the old blocks
};

export const resetWorkspace = () => {
  const workspace = getWorkspace();
  workspace.getAllBlocks(true).forEach((b) => {
    if (b.type !== "arduino_loop" && b.type !== "board_selector") {
      b.dispose(true);
    }
    if (b.type === "arduino_loop") {
      b.setFieldValue(3, "LOOP_TIMES");
    }
  });
};