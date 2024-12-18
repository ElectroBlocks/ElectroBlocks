  import Blockly from "blockly";
import {
  configuredPins,
  getAvailablePins,
} from "../../core/blockly/helpers/getAvialablePinsFromSetupBlock";
import loopTimes from "../../core/blockly/helpers/looptimes";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import { virtualCircuitComment, whatIsAPin } from "../comment-text";
const buttonSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/button/button.png", 15, 15))
      .appendField("Button Setup");

    this.appendDummyInput()
      .appendField("Connected to PIN# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN"
      );
    this.appendDummyInput()
      .appendField("Use PULLUP Resistor ")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "PULLUP_RESISTOR");

    this.appendDummyInput("SHOW_CODE_VIEW").appendField(
      "-------------------------------------"
    );
    this.appendDummyInput()
      .appendField("Loop ")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        "LOOP"
      );
    this.appendDummyInput()
      .appendField("Is button pressed: ")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "is_pressed");
    
    this.appendDummyInput("COPY_ALL")
    .appendField("Copy All: ")
    .appendField(new Blockly.FieldCheckbox(false), "COPY_SAME");
    
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["button_setup"] = buttonSetupBlock;

const isBtnPressedBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/button/button.png", 15, 15, "*")
      )
      .appendField("button")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return configuredPins(
            "button_setup",
            selectBoardBlockly().digitalPins
          );
        }),
        "PIN"
      )
      .appendField("is pressed?");
    this.setOutput(true, "Boolean");

    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["is_button_pressed"] = isBtnPressedBlock;


const release_button = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/button/button.png", 15, 15, "*")
      )
      .appendField("Button")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return configuredPins(
            "button_setup",
            selectBoardBlockly().digitalPins
          );
        }),
        "PIN"
      )
      .appendField("is ")
      .appendField(
        new Blockly.FieldDropdown([
          ["released", "RELEASED"],
          ["pressed", "PRESSED"],
        ]),
        "STATE"
      )
      .appendField(".");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour(COLOR_THEME.SENSOR);
  },
};
Blockly.common.defineBlocks({ release_button: release_button });
                    