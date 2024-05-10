import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["controls_repeat_ext"] = function (block: Block) {
  // Repeat n times.
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
  let code = "";
  const loopVar = "simple_loop_variable";
  code +=
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
    "}\n";

  return code;
};

Blockly["Arduino"]["controls_for"] = function (block: Block) {
  const loopIndexVariable = Blockly.getMainWorkspace().getVariableById(
    block.getFieldValue("VAR")
  ).name;

  const branch = Blockly["Arduino"].statementToCode(block, "DO");

  const startNumber =
    +Blockly["Arduino"].valueToCode(
      block,
      "FROM",
      Blockly["Arduino"].ORDER_ASSIGNMENT
    ) || "0";

  const toNumber =
    +Blockly["Arduino"].valueToCode(
      block,
      "TO",
      Blockly["Arduino"].ORDER_ASSIGNMENT
    ) || "0";

  let byNumber = Math.abs(parseInt(block.getFieldValue("BY")));

  byNumber = byNumber === 0 ? 1 : byNumber;

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

Blockly["Arduino"]["controls_whileUntil"] = function (block: Block) {
  // Do while/until loop.
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
  return "\twhile (" + argument0 + ") {\n" + branch + "\t}\n";
};

Blockly["Arduino"]["controls_flow_statements"] = function (block: Block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue("FLOW")) {
    case "BREAK":
      return "break;\n";
    case "CONTINUE":
      return "continue;\n";
  }
  throw Error("Unknown flow statement.");
};
