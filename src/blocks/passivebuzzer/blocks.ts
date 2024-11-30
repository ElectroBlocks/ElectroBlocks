import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.Blocks["passive_buzzer_note"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          "/blocks/passivebuzzer/passivebuzzer.png",
          15,
          15
        )
      )
      .appendField("Passive Buzzer Note")
      .appendField(
        new Blockly.FieldDropdown([
          ["Off", "0"],
          ["C", "131"],
          ["C#", "139"],
          ["D", "147"],
          ["D#", "156"],
          ["E", "165"],
          ["F", "175"],
          ["F#", "185"],
          ["G", "196"],
          ["G#", "208"],
          ["A", "220"],
          ["A#", "233"],
          ["B", "247"],
        ]),
        "TONE"
      )
      .appendField("Pin")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["passive_buzzer_simple"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          "/blocks/passivebuzzer/passivebuzzer.png",
          15,
          15
        )
      )
      .appendField("Turn passive buzzer #")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN"
      )
      .appendField(
        new Blockly.FieldDropdown([
          ["On", "10000"],
          ["Off", "0"],
        ]),
        "TONE"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["passive_buzzer_tone"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          "/blocks/passivebuzzer/passivebuzzer.png",
          15,
          15
        )
      )
      .appendField("Passive Buzzer")
      .appendField("Pin")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN"
      );
    this.appendValueInput("TONE")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(" Tone");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
