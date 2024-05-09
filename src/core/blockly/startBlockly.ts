import Blockly from "blockly";
import "./menus";
import "./blocks";
import "./overrides/index";
import "./generators/index";

import { theme } from "./theme";

import { addListener, createFrames } from "./registerEvents";
import registerListMenu from "../../blocks/list/menu";
import registerCodeMenu from "../../blocks/arduino/menu";

import { getToolBoxString } from "./toolbox";

import { connectToArduinoBlock, createBlock } from "./helpers/block.helper";
import { ARDUINO_PINS } from "../microcontroller/selectBoard";
import { DELAY_COMMENT } from "../../blocks/time/toolbox";
import { LED_COMMENT } from "../../blocks/led/toolbox";

import { registerVariableMenu } from "../../blocks/variables/menu";
import { registerFunctionMenu } from "../../blocks/functions/menu";

/**
 * This will start up blockly and will add all the event listeners and styles
 */
const startBlockly = (blocklyElement: HTMLElement) => {
  // creates the blockly workspace and toolbox
  const workspace = createWorkspace(blocklyElement);

  // Register custom list menu event for the toolbox
  registerListMenu(workspace);

  registerVariableMenu(workspace);

  registerFunctionMenu(workspace);

  // Setups all the listeners for the blockly events
  addListener(workspace);

  // Registers the code menu
  registerCodeMenu(workspace);

  // creates the arduino loop block
  const arduinoBlock = createBlock("arduino_loop", 50, 151, false);

  // Creating Blink
  createLedWithDelay(0.2, false);
  createLedWithDelay(0.2, true);

  createFrames({
    type: Blockly.Events.MOVE,
    blockId: arduinoBlock.id,
  });
};

/**
 * Creates the Blockly Workspace
 */
const createWorkspace = (blocklyElement: HTMLElement) => {
  Blockly.inject(blocklyElement, createBlockConfig());
  return Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
};

const createLedWithDelay = (seconds = 1, isOn = true) => {
  const ledBlock = createBlock("led", 0, 0, true);
  ledBlock.setCommentText(LED_COMMENT);
  ledBlock.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 90));
  ledBlock.setFieldValue(ARDUINO_PINS.PIN_13, "PIN");
  ledBlock.setFieldValue(isOn ? "ON" : "OFF", "STATE");
  connectToArduinoBlock(ledBlock);
  const delayBlock = createBlock("delay_block", 0, 0, true);

  delayBlock.setCommentText(DELAY_COMMENT);
  delayBlock.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 90));
  const numberBlock1 = createBlock("math_number", 0, 0, true);
  numberBlock1.setFieldValue(seconds.toString(), "NUM");
  delayBlock
    .getInput("DELAY")
    .connection.connect(numberBlock1.outputConnection);
  ledBlock.nextConnection.connect(delayBlock.previousConnection);
};

/**
 * Returns the blockly config object
 */
const createBlockConfig = (): Blockly.BlocklyOptions => {
  const toolboxString = getToolBoxString();

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
