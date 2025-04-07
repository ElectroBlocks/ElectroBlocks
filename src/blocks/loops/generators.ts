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

Blockly["Python"]["controls_repeat_ext"] = function (block: Block) {
  const repeats =
    Blockly["Python"].valueToCode(
      block,
      "TIMES",
      Blockly["Python"].ORDER_NONE
  ) || "0";

  let branch = Blockly["Python"].statementToCode(block, "DO");
  const loopVar = Blockly["Python"].variableDB_.getDistinctName(
    "i", Blockly.Variables.NAME_TYPE
  );

  return `for ${loopVar} in range(1, ${repeats} + 1):\n${Blockly["Python"].addLoopTrap(branch, block.id)}`;
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

// Some AI help for this :(
Blockly["Python"]["controls_for"] = function (block) {
  const variableName = Blockly["Python"].nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Names.NameType.VARIABLE
  );

  const startRaw = Blockly["Python"].valueToCode(block, "FROM", Blockly["Python"].ORDER_NONE) || "0";
  const endRaw = Blockly["Python"].valueToCode(block, "TO", Blockly["Python"].ORDER_NONE) || "0";
  const stepRaw = block.getFieldValue("BY") || "1";

  let start = startRaw;
  let end = endRaw;
  let step = stepRaw;

  const isNumeric = (v) => /^-?\d+(\.\d+)?$/.test(v);

  // Try to convert to numbers if possible
  const isStartNum = isNumeric(startRaw);
  const isEndNum = isNumeric(endRaw);
  const isStepNum = isNumeric(stepRaw);

  if (isStartNum && isEndNum && isStepNum) {
    const startNum = parseFloat(startRaw);
    const endNum = parseFloat(endRaw);
    const stepNum = parseFloat(stepRaw || 1);

    const increasing = startNum <= endNum;
    step = increasing ? stepNum : -Math.abs(stepNum);
    end = increasing ? endNum + 1 : endNum - 1;
  } else {
    // Keep it dynamic for runtime evaluation
    end = `(${end}) + (1 if ${start} <= ${end} else -1)`;
    step = `(${step}) if ${start} <= ${endRaw} else -(${step})`;
  }

  let branch = Blockly["Python"].statementToCode(block, "DO");
  branch = Blockly["Python"].addLoopTrap(branch, block.id);

  const code = `for ${variableName} in range(${start}, ${end}, ${step}):\n${branch}`;
  return code;
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

Blockly["Python"]["controls_whileUntil"] = function (block: Block) {
 const mode = block.getFieldValue("MODE");
 let condition =
  Blockly["Python"].valueToCode(
    block,
    "BOOL",
    Blockly["Python"].ORDER_LOGICAL_NOT
  ) || "False";

  let branch = Blockly["Python"].statementToCode(block, "DO");
  branch = Blockly["Python"].addLoopTrap(branch, block.id);

  if (mode === "UNTIL") {
    condition = `not (${condition})`;
  }

  return `while ${condition}:\n${branch}`; 
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

Blockly["Python"]["controls_flow_statements"] = function (block: Block) {
  const flow = block.getFieldValue("FLOW");
  switch (flow) {
    case "BREAK":
      return "break\n";
    case "CONTINUE":
      return "continue\n";
  }
  throw Error("Unknown flow statement: " + flow);
};
