import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Python"]["procedures_defreturn"] = function (block: Block | any) {
  // Define a procedure with a return value.
  const funcName = Blockly["Python"].variableDB_.getName(
    block.getFieldValue("NAME")
  );
  const branch = Blockly["Python"].statementToCode(block, "STACK");

  let code = `def ${funcName}():
${branch}
`;
  code = Blockly["Python"].scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly["Python"].functionNames_["%" + funcName] = code;
  return null;
};

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

Blockly["Python"]["procedures_defnoreturn"] =
  Blockly["Python"]["procedures_defreturn"];

Blockly["Arduino"]["procedures_callnoreturn"] = function (block: Block | any) {
  // Call a procedure with no return value.
  const funcName = Blockly["Arduino"].variableDB_.getName(
    block.getFieldValue("NAME")
  );

  console.log(funcName, "funcName");

  return funcName + "();\n";
};

Blockly["Python"]["procedures_callnoreturn"] = function (block: Block | any) {
  // Call a procedure with no return value.
  const funcName = Blockly["Arduino"].variableDB_.getName(
    block.getFieldValue("NAME")
  );

  return funcName + "()\n";
};