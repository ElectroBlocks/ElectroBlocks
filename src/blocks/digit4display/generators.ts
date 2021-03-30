import Blockly, { Block } from "blockly";

Blockly["Arduino"]["digital_display_setup"] = function (block: Block) {
  var dropdown_dio_pin = block.getFieldValue("DIO_PIN");
  var dropdown_clk_pin = block.getFieldValue("CLK_PIN");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly["Arduino"]["digital_display_set_text"] = function (block) {
  var value_text = Blockly["Arduino"].valueToCode(
    block,
    "TEXT",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly["Arduino"]["digital_display_set_dots"] = function (block) {
  var checkbox_top_dot = block.getFieldValue("TOP_DOT") == "TRUE";
  var checkbox_bottom_dot = block.getFieldValue("BOTTOM_DOT") == "TRUE";
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};
