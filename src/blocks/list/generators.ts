import Blockly from "blockly";
import type { Block } from "blockly";

export const setZeroIndexAdjustFunc = () => {
  Blockly["Arduino"].functionNames_[
    "zeroIndexAdjustNumber"
  ] = `\nint zeroIndexAdjustNumber(double pos) {
	pos = pos <= 0 ? 0 : pos;
	return pos >= 1 ? pos - 1 : pos;
}`;
};

export const setZeroIndexAdjustFuncPython = () => {
  Blockly["Arduino"].functionNames_[
    "zeroIndexAdjustNumber"
  ] = `def safe_index(pos, length):
    return max(0, min(int(pos) - 1, length - 1))`;
};

const initListVariableC = function (block: Block, type: string) {
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

const setListVariableC = function (block: Block) {
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

const getListVariableC = function (block: Block) {
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

const getListVariablePython = function (block: Block, defaultValue: string) {
  const variableId = block.getFieldValue("VAR");

  const position = Blockly["Python"].valueToCode(
    block,
    "POSITION",
    Blockly["Python"].ORDER_ATOMIC
  );
  const varName = Blockly["Python"].getVariableName(variableId);

  return [
    `get_item_from_list(${varName}, ${position}, ${defaultValue})`,
    Blockly["Python"].ORDER_ATOMIC,
  ];
};

const setListVariablePython = function (block: Block, defaultValue: string) {
  const position = Blockly["Python"].valueToCode(
    block,
    "POSITION",
    Blockly["Python"].ORDER_ATOMIC
  );

  const variableId = block.getFieldValue("VAR");

  const value = Blockly["Python"].valueToCode(
    block,
    "VALUE",
    Blockly["Python"].ORDER_ATOMIC
  );
  const varName = Blockly["Arduino"].getVariableName(variableId);
  return `set_item_in_list(${varName}, ${position}, ${value}, ${defaultValue})\n`;
};

Blockly["Arduino"]["create_list_number_block"] = function (block: Block) {
  return initListVariableC(block, "double");
};

Blockly["Arduino"]["create_list_string_block"] = function (block: Block) {
  return initListVariableC(block, "String");
};

Blockly["Arduino"]["create_list_boolean_block"] = function (block: Block) {
  return initListVariableC(block, "boolean");
};

Blockly["Arduino"]["create_list_colour_block"] = function (block: Block) {
  return initListVariableC(block, "RGB");
};

Blockly["Arduino"]["set_string_list_block"] = setListVariableC;
Blockly["Arduino"]["set_boolean_list_block"] = setListVariableC;
Blockly["Arduino"]["set_number_list_block"] = setListVariableC;
Blockly["Arduino"]["set_colour_list_block"] = setListVariableC;

Blockly["Arduino"]["get_string_from_list"] = getListVariableC;
Blockly["Arduino"]["get_boolean_from_list"] = getListVariableC;
Blockly["Arduino"]["get_number_from_list"] = getListVariableC;
Blockly["Arduino"]["get_colour_from_list"] = getListVariableC;

Blockly["Python"]["get_string_from_list"] = (block: Block) =>
  getListVariablePython(block, '""');
Blockly["Python"]["get_boolean_from_list"] = (block: Block) =>
  getListVariablePython(block, "False");
Blockly["Python"]["get_number_from_list"] = (block: Block) =>
  getListVariablePython(block, "-1");
Blockly["Python"]["get_colour_from_list"] = (block: Block) =>
  getListVariablePython(block, "RGB(0,0,0)");

Blockly["Python"]["set_string_list_block"] = (block: Block) =>
  setListVariablePython(block, '""');
Blockly["Python"]["set_boolean_list_block"] = (block: Block) =>
  setListVariablePython(block, "False");
Blockly["Python"]["set_number_list_block"] = (block: Block) =>
  setListVariablePython(block, "-1");
Blockly["Python"]["set_colour_list_block"] = (block: Block) =>
  setListVariablePython(block, "RGB(0,0,0)");

Blockly["Python"]["create_list_number_block"] = function (block: Block) {
  Blockly["Python"].functionNames_[
    "set_item_from_list"
  ] = `def set_item_in_list(lst, pos, value, fill=None):
    """
    Sets a 1-based position in a list.
    Grows the list if needed using the fill value.
    """
    idx = max(0, int(pos) - 1)

    while idx >= len(lst):
        lst.append(fill)

    lst[idx] = value

`;
  Blockly["Python"].functionNames_[
    "get_item_from_list"
  ] = `def get_item_from_list(lst, pos, default=None):
    """
    Gets a 1-based position from a list.
    Returns default if the position is out of range or the list is empty.
    """
    idx = max(0, int(pos) - 1)
    if 0 <= idx < len(lst):
        return lst[idx]
    return default

`;
  return "";
};
Blockly["Python"]["create_list_string_block"] =
  Blockly["Python"]["create_list_number_block"];
Blockly["Python"]["create_list_boolean_block"] =
  Blockly["Python"]["create_list_number_block"];
Blockly["Python"]["create_list_colour_block"] =
  Blockly["Python"]["create_list_number_block"];

