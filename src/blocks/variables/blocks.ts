import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

[
  {
    type: "number",
    blockName: "number",
    variable_type: "Number",
    end_set_comment: "only numeric input.",
  },
  {
    type: "string",
    blockName: "string",
    variable_type: "String",
    end_set_comment: "string input.",
  },
  {
    type: "boolean",
    blockName: "boolean",
    variable_type: "Boolean",
    end_set_comment: "true or false state.",
  },
  {
    type: "color",
    blockName: "colour",
    variable_type: "Colour",
    end_set_comment: "color codes.",
  },
].forEach(({ type, blockName, variable_type, end_set_comment }) => {
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
      this.setCommentText();

      this.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 80));
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
        .appendField(`${humanType}`)
        .appendField(fieldVar, "VAR")
        .appendField(" = ");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLOR_THEME.DATA);
      this.setTooltip("");
      this.setHelpUrl("");
      this.setCommentText(
        `${variable_type} variable allows you to set values using ${end_set_comment}.`
      );

      this.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 90));
    },
  };
});
