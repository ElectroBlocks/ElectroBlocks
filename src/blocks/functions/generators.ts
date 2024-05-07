import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["procedures_defreturn"] = function (block: Block | any) {
  // Define a procedure with a return value.
  const funcName = Blockly["Arduino"].variableDB_.getName(
    block.getFieldValue("NAME")
  );
  const branch = Blockly["Arduino"].statementToCode(block, "STACK");
  const returnType = block.getFieldValue("RETURN TYPE") || "void";

  let returnValue =
    Blockly["Arduino"].valueToCode(
      block,
      "RETURN",
      Blockly["Arduino"].ORDER_NONE
    ) || "";
  if (returnValue) {
    returnValue = Blockly["Arduino"].INDENT + "return " + returnValue + ";\n";
  }

  let code =
    translateType(returnType) +
    " " +
    funcName +
    "() {\n" +
    branch +
    returnValue +
    "}";
  code = Blockly["Arduino"].scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly["Arduino"].functionNames_["%" + funcName] = code;
  return null;
};

function translateType(type) {
  switch (type) {
    case "Number":
      return "double";
    case "String":
      return "String";
    case "Boolean":
      return "boolean";
    case "void":
      return "void";
    default:
      throw new Error("Invalid Parameter Type");
  }
}

Blockly["Arduino"]["procedures_defnoreturn"] =
  Blockly["Arduino"]["procedures_defreturn"];

Blockly["Arduino"]["procedures_callnoreturn"] = function (block: Block | any) {
  // Call a procedure with no return value.
  const funcName = Blockly["Arduino"].variableDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.DEFAULT_ARG
  );

  return funcName + "();\n";
};
