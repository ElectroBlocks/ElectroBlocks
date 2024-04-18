import Blockly from "blockly";

const registerCodeMenu = (workspace: Blockly.WorkspaceSvg) => {
  workspace.registerToolboxCategoryCallback("CODE", () => {
    const xmlList = [];
    const setupBlock = workspace
      .getAllBlocks(true)
      .filter((b) => b.type === "arduino_setup");

    // Only show the debug if it's not workspace
    if (setupBlock.length === 0) {
      const xmlArduinoSetupBlock = Blockly.utils.xml.createElement("block");
      xmlArduinoSetupBlock.setAttribute("type", "arduino_setup");

      xmlList.push(xmlArduinoSetupBlock);
    }

    const xmlDebugBlock = Blockly.utils.xml.createElement("block");
    xmlDebugBlock.setAttribute("type", "debug_block");

    xmlList.push(xmlDebugBlock);
    return xmlList;
  });
};

export default registerCodeMenu;
