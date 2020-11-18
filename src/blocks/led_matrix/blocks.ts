import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["led_matrix_turn_one_on_off"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/led_matrix/led_matrix.png", 15, 15)
      )
      .appendField("Turn one led in led matrix")
      .appendField(
        new Blockly.FieldDropdown([
          ["on", "ON"],
          ["off", "OFF"],
        ]),
        "STATE"
      );
    this.appendValueInput("ROW")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Row");
    this.appendValueInput("COLUMN")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Column");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `Turns or off one led on the led matrix.  

The higher the number for the column, the more right the led will be.  The higher the number for the row, the lower the will be.`
    );
    this.comment.setBubbleSize(553, 120);
  },
};

Blockly.Blocks["led_matrix_make_draw"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/led_matrix/led_matrix.png", 15, 15)
      )
      .appendField("Led Matrix Draw");
    for (let i = 1; i <= 8; i += 1) {
      let inputDumyField = this.appendDummyInput();
      for (let j = 1; j <= 8; j += 1) {
        inputDumyField.appendField(
          new Blockly.FieldCheckbox("FALSE"),
          `${i},${j}`
        );
      }
    }
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `Check the checkboxes to draw a pattern on the led matrix.`
    );
    this.comment.setBubbleSize(553, 60);
  },
};

Blockly.Blocks["led_matrix_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/led_matrix/led_matrix.png", 15, 15)
      )
      .appendField("Led Matrix Setup");
    this.appendDummyInput()
      .appendField("Data Pin#")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_DATA"
      );
    this.appendDummyInput()
      .appendField("CLK Pin#")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_CLK"
      );
    this.appendDummyInput()
      .appendField("CS Pin#")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_CS"
      );
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `This block sets up the let matrix.  You can use any digital pins you want.`
    );
    this.comment.setBubbleSize(553, 60);

  },
};
