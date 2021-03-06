import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

[
  { type: "number", blockName: "number", variable_type: "Number" },
  { type: "string", blockName: "string", variable_type: "String" },
  { type: "boolean", blockName: "boolean", variable_type: "Boolean" },
  { type: "color", blockName: "colour", variable_type: "Colour" },
].forEach(({ type, blockName, variable_type }) => {
  const humanType = type === "string" ? "text" : type;

  Blockly.Blocks[`variables_get_${blockName}`] = {
    init: function () {
      const fieldVar = new Blockly.FieldVariable(
        null,
        null,
        [variable_type],
        variable_type
      );
      (fieldVar as any).createNewVariable = false;
      (fieldVar as any).showOnlyVariableAssigned = false;
      this.appendDummyInput()
        .appendField(`= ${humanType} variable`)
        .appendField(fieldVar, "VAR");
      this.setOutput(true, variable_type);
      this.setColour(COLOR_THEME.DATA);
      this.setTooltip("");
      this.setHelpUrl("");
      this.setCommentText(
        `This block gets the value that the variable is storing.  This variable store a ${type}.`
      );
      if (typeof this.comment !== "string") {
        this.comment.setBubbleSize(460, 80);
      }
    },
  };

  Blockly.Blocks[`variables_set_${blockName}`] = {
    init: function () {
      const fieldVar = new Blockly.FieldVariable(
        null,
        null,
        [variable_type],
        variable_type
      );
      (fieldVar as any).createNewVariable = false;
      (fieldVar as any).showOnlyVariableAssigned = false;
      this.appendValueInput("VALUE")
        .setCheck(variable_type)
        .appendField(`${humanType} variable`)
        .appendField(fieldVar, "VAR")
        .appendField(" = ");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLOR_THEME.DATA);
      this.setTooltip("");
      this.setHelpUrl("");
      this.setCommentText(
        `The value of the variable is what the variable is storing. Variables in Arduino will only store a specific type of data.  This variable will store ${humanType} only.`
      );
      if (typeof this.comment !== "string") {
        this.comment.setBubbleSize(460, 90);
      }
    },
  };
});
