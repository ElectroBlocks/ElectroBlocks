import type { WorkspaceSvg } from "blockly";
import Blockly from "blockly";
import { arduinoLoopBlockShowLoopForeverText } from "./arduino_loop_block.helper";
import { getAllBlocks } from "./block.helper";
import { deleteVariable, getAllVariables } from "./variable.helper";

import settingsStore from "../../../stores/settings.store";
import { get } from "svelte/store";


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
  let settings = get(settingsStore);
  settingsStore.subscribe((newSettings) => {
    settings = newSettings;
  });
  if(settings.language === "C"){
    return Blockly["Arduino"].workspaceToCode(getWorkspace()) as string;
  }else{
  const resetPythonCode = `# Python Code Snippet
   print("Hello, World!")`;
   return resetPythonCode;
  }
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
  getAllVariables().forEach((v) => deleteVariable(v.getId()));
  const blocksToDelete = getAllBlocks(); // get a list of all the old blocks
  const xml = parser.parseFromString(xmlString, "application/xml");
  Blockly.Xml.domToWorkspace(xml.documentElement as any, getWorkspace()); // load new blocks
  blocksToDelete.forEach((b) => b.dispose(true)); // delete the old blocks
  localStorage.removeItem("no_alert");
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
