import Blockly from "blockly";
import type { Block } from "blockly";

export const setZeroIndexAdjustFunc = () => {
  Blockly["Arduino"].functionNames_["zeroIndexAdjustNumber"] =
    "\n\nint zeroIndexAdjustNumber(double pos) {\n" +
    "\tpos = pos <= 0 ? 0 : pos;\n" +
    "\treturn pos >= 1 ? pos - 1 : pos;\n" +
    "}\n";
};

const initListVariable = function (block: Block, type: string) {
  setZeroIndexAdjustFunc();

  const preStructBeforeVar = ["RGB"].includes(type) ? "struct " : "";

  const size = block.getFieldValue("SIZE");

  const variableId = block.getFieldValue("VAR");

  Blockly["Arduino"].variablesInitCode_ +=
    preStructBeforeVar +
    type.replace(" list", "") +
    " " +
    Blockly["Arduino"].getVariableName(variableId) +
    "[" +
    size +
    "];\n";

  return "";
};

const setListVariable = function (block: Block) {
  const position = Blockly["Arduino"].valueToCode(
    block,
    "POSITION",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  const variableId = block.getFieldValue("VAR");

  const value = Blockly["Arduino"].valueToCode(
    block,
    "VALUE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return (
    Blockly["Arduino"].getVariableName(variableId) +
    "[zeroIndexAdjustNumber(" +
    position +
    ")] = " +
    value +
    ";\n"
  );
};

const getListVariable = function (block: Block) {
  const variableId = block.getFieldValue("VAR");

  const position = Blockly["Arduino"].valueToCode(
    block,
    "POSITION",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return [
    Blockly["Arduino"].getVariableName(variableId) +
      "[zeroIndexAdjustNumber(" +
      position +
      ")]",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Arduino"]["create_list_number_block"] = function (block: Block) {
  return initListVariable(block, "double");
};

Blockly["Arduino"]["create_list_string_block"] = function (block: Block) {
  return initListVariable(block, "String");
};

Blockly["Arduino"]["create_list_boolean_block"] = function (block: Block) {
  return initListVariable(block, "boolean");
};

Blockly["Arduino"]["create_list_colour_block"] = function (block: Block) {
  return initListVariable(block, "RGB");
};

Blockly["Arduino"]["set_string_list_block"] = setListVariable;
Blockly["Arduino"]["set_boolean_list_block"] = setListVariable;
Blockly["Arduino"]["set_number_list_block"] = setListVariable;
Blockly["Arduino"]["set_colour_list_block"] = setListVariable;

Blockly["Arduino"]["get_string_from_list"] = getListVariable;
Blockly["Arduino"]["get_boolean_from_list"] = getListVariable;
Blockly["Arduino"]["get_number_from_list"] = getListVariable;
Blockly["Arduino"]["get_colour_from_list"] = getListVariable;
