import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

[
  { type: "number", blockName: "number", variable_type: "List Number" },
  { type: "string", blockName: "string", variable_type: "List String" },
  { type: "boolean", blockName: "boolean", variable_type: "List Boolean" },
  { type: "color", blockName: "colour", variable_type: "List Colour" },
].forEach(({ type, blockName, variable_type }) => {
  const humanType = type === "string" ? "text" : type;

  Blockly.Blocks[`create_list_${blockName}_block`] = {
    init: function () {
      const varField = new Blockly.FieldVariable(
        null,
        null,
        [variable_type],
        variable_type
      );
      (varField as any).showOnlyVariableAssigned = true;
      (varField as any).createNewVariable = false;
      this.appendDummyInput()
        .appendField(`List`)
        .appendField(varField, "VAR")
        .appendField(" stores ")
        .appendField(new Blockly.FieldNumber(2, 2, 1000), "SIZE")
        .appendField(` ${humanType}s`);

      this.setColour(COLOR_THEME.DATA);
      this.setTooltip("");
      this.setHelpUrl("");
      this.setCommentText(
        `This block creates a list of ${humanType}s.  The size determines how many ${humanType}s are in the list.`
      );

      this.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 80));
    },
  };

  Blockly.Blocks[`set_${blockName}_list_block`] = {
    init: function () {
      const varField = new Blockly.FieldVariable(
        null,
        null,
        [variable_type],
        variable_type
      );
      (varField as any).showOnlyVariableAssigned = false;

      this.appendValueInput("VALUE")
        .setCheck(variable_type.replace("List ", ""))
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(`Store ${humanType}`);
      this.appendValueInput("POSITION")
        .setCheck("Number")
        .appendField(" in ")
        .appendField(varField, "VAR")
        .appendField(" at position ");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLOR_THEME.DATA);
      this.setTooltip("");
      this.setHelpUrl("");

      this.setCommentText(
        `This block puts a ${humanType} into the list.  The position determines where in the list the ${humanType} will be.  The first ${humanType} in the list starts at position 1.`
      );
      this.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 120));
    },
  };

  Blockly.Blocks[`get_${blockName}_from_list`] = {
    init: function () {
      const varField = new Blockly.FieldVariable(
        null,
        null,
        [variable_type],
        variable_type
      );
      (varField as any).showOnlyVariableAssigned = false;

      this.appendDummyInput()
        .appendField(`Get ${humanType} from `)
        .appendField(varField, "VAR");
      this.appendValueInput("POSITION")
        .setCheck("Number")
        .appendField(" at position ");
      this.setInputsInline(true);
      this.setOutput(true, variable_type.replace("List ", ""));
      this.setColour(COLOR_THEME.DATA);
      this.setTooltip("");
      this.setHelpUrl("");
      this.setCommentText(
        `This block gets a ${humanType} from the list.  The position determines where in the list you are getting the ${humanType}.  The first ${humanType} in the list starts at position 1.`
      );

      this.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 120));
    },
  };
});
