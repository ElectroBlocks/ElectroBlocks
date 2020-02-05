import Blockly, { WorkspaceSvg } from 'blockly';

import './menu/variable.menu';
import './menu/function.menu';
import './blocks/index';

import registerListeners from './events/registerEvents';
import registerListMenu from './menu/list.menu';

import getToolBoxString from '../services/toolbox/getToolBoxString';
import { fetchToolBox } from '../services/toolbox/toolbox';

import { createBlock } from './helpers/workspace';

/**
 * This will start up blockly and will add all the event listeners and styles
 */
const startBlockly = (blocklyElement: HTMLElement) => {
  const workspace = createWorkspace(blocklyElement);

  createBlock('arduino_loop', 50, 100, false);

  // Register custom list menu event for the toolbox
  registerListMenu(workspace);

  // Setups all the listeners for the blockly events
  registerListeners(workspace);
};

/**
 * Creates the Blockly Workspace
 *
 * @param {HTMLElmeent} Blockly workspace container element
 * @returns {Blockly.Workspace}
 */
const createWorkspace = (blocklyElement) => {
  Blockly.inject(blocklyElement, createBlockConfig());
  return Blockly.getMainWorkspace() as WorkspaceSvg;
};

/**
 * Returns the blockly config object
 *
 * @returns {Object}
 */
const createBlockConfig = () => {
  const savedToolOptions = fetchToolBox();
  const toolboxString = getToolBoxString(savedToolOptions);

  return {
    toolbox: toolboxString,
    collapse: true,
    comments: true,
    disable: false,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: 'start',
    css: true,
    media: 'https://blockly-demo.appspot.com/static/media/',
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    grid: {
      spacing: 20,
      length: 1,
      colour: '#888',
      snap: false
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    }
  };
};

export default startBlockly;
