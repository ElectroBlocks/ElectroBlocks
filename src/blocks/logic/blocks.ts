import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["control_if"] = {
  init: function () {
    this.appendValueInput("IF0").setCheck("Boolean").appendField("If");
    this.appendStatementInput("DO0").setCheck(null).appendField("Then");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.CONTROL);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `"If blocks" will run the code in the Then section if what is inside the If what is attached to IF Section equals true.  If you connected the is_button_pressed block to the IF Section and the button is pressed, then the then section’s code will run.`
    );
    this.comment.setBubbleSize(460, 120);
  },
};

Blockly.Blocks["controls_ifelse"] = {
  init: function () {
    this.appendValueInput("IF0").setCheck("Boolean").appendField("If");
    this.appendStatementInput("DO0").setCheck(null).appendField("Then");
    this.appendStatementInput("ELSE").setCheck(null).appendField("Else");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.CONTROL);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `"If Else blocks" will run the code in the Then section if what is inside the If what is attached to IF Section equals true.  If you connected the is_button_pressed block to the IF Section and the button is pressed, then the then section’s code will run.  If the button is not pressed the else section would run.`
    );
    this.comment.setBubbleSize(460, 120);
  },
};

Blockly.Blocks["logic_compare"] = {
  init: function () {
    this.appendValueInput("A").setCheck(null);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["==", "EQ"],
        ["!=", "NEQ"],
        [">", "GT"],
        [">=", "GTE"],
        ["<", "LT"],
        ["<=", "LTE"],
      ]),
      "OP"
    );
    this.appendValueInput("B").setCheck(null);
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(COLOR_THEME.CONTROL);
    this.setTooltip("");
    this.setHelpUrl("");
    this
      .setCommentText(`Compares what is in the left and right holes and returns true or false.

If the operator ==, it will check if both values are the same.
If the operator !=, it will check if both values are different.
If the operator >, it will check if the left value is greater than the right value.
If the operator >=, it will check if the left value is greater than or equal to the right value.
If the operator <, it will check if the left value is less than the right value.
If the operator <=, it will check if the left value is less than or equal to the right value.
`);
    this.comment.setBubbleSize(460, 285);

  },
};

Blockly.Blocks["logic_operation"] = {
  init: function () {
    this.appendValueInput("A").setCheck(null);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["AND", "AND"],
        ["OR", "OR"],
      ]),
      "OP"
    );
    this.appendValueInput("B").setCheck(null);
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(COLOR_THEME.CONTROL);
    this.setTooltip("");
    this.setHelpUrl("");

        this
          .setCommentText(`Compares what is in the left and right holes and returns true or false.

If the operator is “and”, it will check if both values are equal to true.
If the operator is “or”, it will check if one of the values are true.
`);
        this.comment.setBubbleSize(460, 185);


  },
};

Blockly.Blocks["logic_negate"] = {
  init: function () {
    this.appendValueInput("BOOL").setCheck("Boolean").appendField("not");
    this.setOutput(true, "Boolean");
    this.setColour(COLOR_THEME.CONTROL);
    this.setTooltip("");
    this.setHelpUrl("");
    this
      .setCommentText(`Will take a true and turn it to false and take a false and turn it into true.`);
    this.comment.setBubbleSize(460, 60);

  },
};
