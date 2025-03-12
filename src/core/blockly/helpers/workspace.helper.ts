import type { WorkspaceSvg } from "blockly";
import Blockly from "blockly";
import { arduinoLoopBlockShowLoopForeverText } from "./arduino_loop_block.helper";
import { getAllBlocks } from "./block.helper";
import { deleteVariable, getAllVariables } from "./variable.helper";

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
  return Blockly["Arduino"].workspaceToCode(getWorkspace()) as string;
};

export const workspaceToXML = () => {
  let workspace = getWorkspace();
  if (!workspace) return;
  const xml = Blockly.Xml.workspaceToDom(workspace);
  return Blockly.Xml.domToText(xml);
};

export const loadProjectFromUrl = async (url: string) => {
  const response = await fetch(url);
  const fileText = await response.text();

  loadProject(fileText);
};

export const loadProject = (xmlString: string) => {
  var parser = new DOMParser();
  localStorage.setItem("no_alert", "yes");
  // Delete all the old blocks and variables
  const blocksToDelete = getAllBlocks(); // get a list of all the old blocks
  blocksToDelete.forEach((b) => b.dispose(false)); // delete the old blocks
  getAllVariables().forEach((v) => deleteVariable(v.getId()));
  // Load the new blocks
  const xml = parser.parseFromString(xmlString, "application/xml");
  Blockly.Xml.domToWorkspace(xml.documentElement as any, getWorkspace()); // load new blocks
  localStorage.removeItem("no_alert");

  // Scroll to the center
  getWorkspace().scrollCenter();
};

export const resetWorkspace = () => {
  const workspace = getWorkspace();
  workspace.getAllBlocks(true).forEach((b) => {
    if (b.type !== "arduino_loop") {
      b.dispose(true);
    }
    if (b.type === "arduino_loop") {
      b.setFieldValue(3, "LOOP_TIMES");
    }
  });
};
