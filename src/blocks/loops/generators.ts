import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["controls_repeat_ext"] = function (block: Block) {
  Blockly["Arduino"].libraries_["controls_repeat_ext"] =
    "int simple_loop_variable = 0;";
  const repeats =
    Blockly["Arduino"].valueToCode(
      block,
      "TIMES",
      Blockly["Arduino"].ORDER_ASSIGNMENT
    ) || "0";

  let branch = Blockly["Arduino"].statementToCode(block, "DO");
  branch = Blockly["Arduino"].addLoopTrap(branch, block.id);
  const loopVar = "simple_loop_variable";

  return (
    "for (" +
    loopVar +
    " = 1; " +
    loopVar +
    " <= " +
    repeats +
    "; " +
    loopVar +
    " += 1) {\n" +
    branch +
    "}\n"
  );
};

Blockly["Python"]["controls_repeat_ext"] = function (block: Block) {
  const repeats =
    Blockly["Python"].valueToCode(
      block,
      "TIMES",
      Blockly["Python"].ORDER_ASSIGNMENT
    ) || "0";
  let branch = Blockly["Python"].statementToCode(block, "DO");
  return "for _ in range(" + repeats + "):\n" + Blockly["Python"].prefixLines(branch, "    ");
};

Blockly["Arduino"]["controls_for"] = function (block: Block) {
  const loopIndexVariable = Blockly.getMainWorkspace().getVariableById(
    block.getFieldValue("VAR")
  ).name;
  const branch = Blockly["Arduino"].statementToCode(block, "DO");
  const startNumber =
    Blockly["Arduino"].valueToCode(
      block,
      "FROM",
      Blockly["Arduino"].ORDER_ASSIGNMENT
    ) || "0";
  const toNumber =
    Blockly["Arduino"].valueToCode(
      block,
      "TO",
      Blockly["Arduino"].ORDER_ASSIGNMENT
    ) || "0";
  let byNumber = Math.abs(parseInt(block.getFieldValue("BY"))) || 1;
  const addingSub = startNumber < toNumber ? " +" : " -";
  const sign = startNumber < toNumber ? " <= " : " >= ";

  return (
    "for (" +
    loopIndexVariable +
    " = " +
    startNumber +
    "; " +
    loopIndexVariable +
    sign +
    toNumber +
    "; " +
    loopIndexVariable +
    addingSub +
    "= " +
    byNumber +
    ") {\n" +
    branch +
    "}\n"
  );
};

Blockly["Python"]["controls_for"] = function (block: Block) {
  const loopIndexVariable = Blockly["Python"].nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );
  const startNumber =
    Blockly["Python"].valueToCode(
      block,
      "FROM",
      Blockly["Python"].ORDER_ASSIGNMENT
    ) || "0";
  const toNumber =
    Blockly["Python"].valueToCode(
      block,
      "TO",
      Blockly["Python"].ORDER_ASSIGNMENT
    ) || "0";
  const byNumber = parseInt(block.getFieldValue("BY")) || 1;
  const branch = Blockly["Python"].statementToCode(block, "DO");
  return (
    "for " + loopIndexVariable + " in range(" + startNumber + ", " + toNumber + " + 1, " + byNumber + "):\n" +
    Blockly["Python"].prefixLines(branch, "    ")
  );
};

Blockly["Arduino"]["controls_whileUntil"] = function (block: Block) {
  const until = block.getFieldValue("MODE") === "UNTIL";
  let argument0 =
    Blockly["Arduino"].valueToCode(
      block,
      "BOOL",
      Blockly["Arduino"].ORDER_LOGICAL_AND
    ) || "false";
  let branch = Blockly["Arduino"].statementToCode(block, "DO");
  branch = Blockly["Arduino"].addLoopTrap(branch, block.id);
  if (until) {
    argument0 = "!" + argument0;
  }
  return "while (" + argument0 + ") {\n" + branch + "}\n";
};

Blockly["Python"]["controls_whileUntil"] = function (block: Block) {
  const until = block.getFieldValue("MODE") === "UNTIL";
  let argument0 =
    Blockly["Python"].valueToCode(
      block,
      "BOOL",
      Blockly["Python"].ORDER_LOGICAL_AND
    ) || "False";
  let branch = Blockly["Python"].statementToCode(block, "DO");
  if (until) {
    argument0 = "not " + argument0;
  }
  return "while " + argument0 + ":\n" + Blockly["Python"].prefixLines(branch, "    ");
};

Blockly["Arduino"]["controls_flow_statements"] = function (block: Block) {
  switch (block.getFieldValue("FLOW")) {
    case "BREAK":
      return "break;\n";
    case "CONTINUE":
      return "continue;\n";
  }
  throw Error("Unknown flow statement.");
};

Blockly["Python"]["controls_flow_statements"] = function (block: Block) {
  switch (block.getFieldValue("FLOW")) {
    case "BREAK":
      return "break\n";
    case "CONTINUE":
      return "continue\n";
  }
  throw Error("Unknown flow statement.");
};
