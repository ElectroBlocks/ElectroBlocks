import Blockly, { WorkspaceSvg, BlocklyOptions } from "blockly";

import "./menu/index";
import "./blocks/index";
import "./overrides/index";
import "./generators/index";

import { theme } from "./theme";

import registerListeners from "./registerEvents";
import registerListMenu from "./menu/list.menu";
import registerCodeMenu from "./menu/code.menu";

import getToolBoxString from "./toolbox/getToolBoxString";
import { fetchToolBox } from "./toolbox/toolbox";

import { createBlock } from "./helpers/block.helper";

/**
 * This will start up blockly and will add all the event listeners and styles
 */
const startBlockly = (blocklyElement: HTMLElement) => {
  // creates the blockly workspace and toolbox
  const workspace = createWorkspace(blocklyElement);

  // Create the blocks for selecting the board
  createBlock("board_selector", 50, 50, false);

  // creates the arduino loop block
  createBlock("arduino_loop", 50, 150, false);

  // Register custom list menu event for the toolbox
  registerListMenu(workspace);

  // Setups all the listeners for the blockly events
  registerListeners(workspace);

  // Registers the code menu
  registerCodeMenu(workspace);
};

/**
 * Creates the Blockly Workspace
 */
const createWorkspace = (blocklyElement: HTMLElement) => {
  Blockly.inject(blocklyElement, createBlockConfig());
  return Blockly.getMainWorkspace() as WorkspaceSvg;
};

/**
 * Returns the blockly config object
 */
const createBlockConfig = (): BlocklyOptions => {
  const savedToolOptions = fetchToolBox();
  const toolboxString = getToolBoxString(savedToolOptions);

  return {
    toolbox: toolboxString,
    collapse: true,
    comments: true,
    disable: false,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: "start",
    css: true,
    media: "https://blockly-demo.appspot.com/static/media/",
    rtl: false,
    sounds: true,
    theme,
    oneBasedIndex: true,
    grid: {
      spacing: 20,
      length: 1,
      colour: "#888",
      snap: false,
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
  };
};

export default startBlockly;
