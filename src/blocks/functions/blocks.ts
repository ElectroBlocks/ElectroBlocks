import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["procedures_defnoreturn"] = {
  /**
   * Block for defining a procedure with no return value.
   * @this Blockly.Block
   */
  init: function () {
    var nameField = new Blockly.FieldTextInput("", Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
      .appendField("create block")
      .appendField(nameField, "NAME");
    // Disabling the ability to add parameters to functions
    // this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    if (
      (this.workspace.options.comments ||
        (this.workspace.options.parentWorkspace &&
          this.workspace.options.parentWorkspace.options.comments)) &&
      Blockly.Msg["PROCEDURES_DEFNORETURN_COMMENT"]
    ) {
      this.setCommentText(
        `This block allows you to create your own blocks.  The blocks you put inside this block will ran when you use your custom block.`
      );

      this.getIcon("comment")?.setBubbleSize(new Blockly.utils.Size(460, 110));
    }
    this.setStyle("procedure_blocks");
    this.setTooltip(Blockly.Msg["PROCEDURES_DEFNORETURN_TOOLTIP"]);
    this.setHelpUrl(Blockly.Msg["PROCEDURES_DEFNORETURN_HELPURL"]);
    this.setStatements_(true);
    this.statementConnection_ = null;
  },
  /**
   * Add or remove the statement block from this function definition.
   * @param {boolean} hasStatements True if a statement block is needed.
   * @this Blockly.Block
   */
  setStatements_: function (hasStatements) {
    if (this.hasStatements_ === hasStatements) {
      return;
    }
    if (hasStatements) {
      this.appendStatementInput("STACK").appendField(
        Blockly.Msg["PROCEDURES_DEFNORETURN_DO"]
      );
    } else {
      this.removeInput("STACK", true);
    }
    this.hasStatements_ = hasStatements;
  },

  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES NOT have a return value.
   * @this Blockly.Block
   */
  getProcedureDef: function () {
    return [this.getFieldValue("NAME"), [], false];
  },

  callType_: "procedures_callnoreturn",
};
