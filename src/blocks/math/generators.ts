import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["math_number"] = function (block: Block) {
  // Numeric value.
  return [
    parseFloat(block.getFieldValue("NUM")),
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Python"]["math_number"] = function (block: Block) {
  return [
    parseFloat(block.getFieldValue("NUM")),
    Blockly["Python"].ORDER_ATOMIC,
  ];
};

Blockly["Arduino"]["math_arithmetic"] = function (block: Block) {
  // Basic arithmetic operators, and power.
  const OPERATORS = {
    ADD: [" + ", Blockly["Arduino"].ORDER_ASSIGNMENT],
    MINUS: [" - ", Blockly["Arduino"].ORDER_ASSIGNMENT],
    MULTIPLY: [" * ", Blockly["Arduino"].ORDER_ASSIGNMENT],
    DIVIDE: [" / ", Blockly["Arduino"].ORDER_ASSIGNMENT],
    POWER: [null, Blockly["Arduino"].ORDER_ASSIGNMENT], // Handle power separately.
  };
  const tuple = OPERATORS[block.getFieldValue("OP")];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Blockly["Arduino"].valueToCode(block, "A", order) || "0";
  const argument1 = Blockly["Arduino"].valueToCode(block, "B", order) || "0";
  let code;
  // Power in Arduino requires a special case since it has no operator.
  if (!operator) {
    code = "pow(" + argument0 + ", " + argument1 + ")";
    return [code, Blockly["Arduino"].ORDER_ASSIGNMENT];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly["Python"]["math_arithmetic"] = function (block: Block) {
  const OPERATORS = {
    ADD: [" + ", Blockly["Python"].ORDER_ASSIGNMENT],
    MINUS: [" - ", Blockly["Python"].ORDER_ASSIGNMENT],
    MULTIPLY: [" * ", Blockly["Python"].ORDER_ASSIGNMENT],
    DIVIDE: [" / ", Blockly["Python"].ORDER_ASSIGNMENT],
    POWER: [" ** ", Blockly["Python"].ORDER_ASSIGNMENT],
  };
  const tuple = OPERATORS[block.getFieldValue("OP")];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Blockly["Python"].valueToCode(block, "A", order) || "0";
  const argument1 = Blockly["Python"].valueToCode(block, "B", order) || "0";
  let code;
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly["Arduino"]["math_round"] = function (block: Block) {
  const operator = block.getFieldValue("OP");
  const arg =
    Blockly["Arduino"].valueToCode(
      block,
      "NUM",
      Blockly["Arduino"].ORDER_NONE
    ) || "0";
  let code = "";
  switch (operator) {
    case "ROUND":
      code = "(double)round(" + arg + ")";
      break;
    case "ROUNDUP":
      code = "(double)ceil(" + arg + ")";
      break;
    case "ROUNDDOWN":
      code = "(double)floor(" + arg + ")";
      break;
    default:
      throw Error("No option for this operator: " + operator);
  }

  return [code, Blockly["Arduino"].ORDER_UNARY_PREFIX];
};

Blockly["Python"]["math_round"] = function (block: Block) {
  const operator = block.getFieldValue("OP");
  const arg = 
    Blockly["Python"].valueToCode(
      block,
      "NUM",
      Blockly["Python"].ORDER_NONE
  ) || "0";
  let code;
  switch (operator) {
    case "ROUND":
      code = `round(${arg})`;
      break;
    case "ROUNDUP":
      Blockly["Python"].imports_["import_math"] = "import math";
      code = `math.ceil(${arg})`
      break;
    case "ROUNDDOWN":
      Blockly["Python"].imports_["import_math"] = "import math";
      code = `math.floor(${arg})`
      break;
    default:
      throw Error("No option for this operator: " + operator);
  }

  return [code, Blockly["Python"].ORDER_FUNCTION_CALL];
};

Blockly["Arduino"]["math_modulo"] = function (block: Block) {
  const dividend =
    Blockly["Arduino"].valueToCode(
      block,
      "DIVIDEND",
      Blockly["Arduino"].ORDER_MODULUS
    ) || "0";
  const divisor =
    Blockly["Arduino"].valueToCode(
      block,
      "DIVISOR",
      Blockly["Arduino"].ORDER_MODULUS
    ) || "0";

  const code = "(double)((int)" + dividend + " % (int)" + divisor + ")";

  return [code, Blockly["Arduino"].ORDER_MODULUS];
};

Blockly["Python"]["math_modulo"] = function (block: Block) {
  const dividend =
    Blockly["Python"].valueToCode(
      block,
      "DIVIDEND",
      Blockly["Python"].ORDER_MODULUS
    ) || "0";
  const divisor =
    Blockly["Python"].valueToCode(
      block,
      "DIVISOR",
      Blockly["Python"].ORDER_MODULUS
    ) || "0";

  const code = "(" + dividend + " % " + divisor + ")";

  return [code, Blockly["Python"].ORDER_MODULUS];
};

Blockly["Arduino"]["math_number_property"] = function (block: Block) {
  const number =
    Blockly["Arduino"].valueToCode(
      block,
      "NUMBER_TO_CHECK",
      Blockly["Arduino"].ORDER_MODULUS
    ) || 1;

  const checkBy = block.getFieldValue("PROPERTY");

  if (checkBy === "EVEN") {
    const code = "((int)" + number + " % 2 == 0)";
    return [code, Blockly["Arduino"].ORDER_MODULUS];
  }

  if (checkBy === "ODD") {
    const code = "((int)" + number + " % 2 == 1)";
    return [code, Blockly["Arduino"].ORDER_MODULUS];
  }

  if (checkBy === "POSITIVE") {
    const code = "(" + number + " > 0)";
    return [code, Blockly["Arduino"].ORDER_MODULUS];
  }

  if (checkBy === "NEGATIVE") {
    const code = "(" + number + " < 0)";
    return [code, Blockly["Arduino"].ORDER_MODULUS];
  }

  if (checkBy === "DIVISIBLE_BY") {
    const divisor =
      Blockly["Arduino"].valueToCode(
        block,
        "DIVISOR",
        Blockly["Arduino"].ORDER_MODULUS
      ) || 1;
    const code = "((int)" + number + " % (int)" + divisor + " == 0)";
    return [code, Blockly["Arduino"].ORDER_MODULUS];
  }

  return ["false", Blockly["Arduino"].ORDER_MODULUS];
};

Blockly["Python"]["math_number_property"] = function (block) {
  const number = Blockly["Python"].valueToCode(
    block,
    "NUMBER_TO_CHECK",
    Blockly["Python"].ORDER_MODULUS
  ) || "0";

  const checkBy = block.getFieldValue("PROPERTY");

  let code;

  if (checkBy === "EVEN") {
    code = `(${number} % 2 == 0)`;
  } else if (checkBy === "ODD") {
    code = `(${number} % 2 == 1)`;
  } else if (checkBy === "POSITIVE") {
    code = `(${number} > 0)`;
  } else if (checkBy === "NEGATIVE") {
    code = `(${number} < 0)`;
  } else if (checkBy === "DIVISIBLE_BY") {
    const divisor = Blockly["Python"].valueToCode(
      block,
      "DIVISOR",
      Blockly["Python"].ORDER_MODULUS
    ) || "1";
    code = `(${number} % ${divisor} == 0)`;
  } else {
    code = "False";
  }

  return [code, Blockly["Python"].ORDER_MODULUS];
};


Blockly["Arduino"]["math_random_int"] = function (block: Block) {
  const start =
    Blockly["Arduino"].valueToCode(
      block,
      "FROM",
      Blockly["Arduino"].ORDER_MODULUS
    ) || 0;

  const finish =
    Blockly["Arduino"].valueToCode(
      block,
      "TO",
      Blockly["Arduino"].ORDER_MODULUS
    ) || 1;

  let code = "";
  if (start > finish) {
    code = "(double)random(" + finish + ", " + start + ")";
  } else {
    code = "(double)random(" + start + ", " + finish + ")";
  }

  return [code, Blockly["Arduino"].ORDER_UNARY_POSTFIX];
};

Blockly["Python"]["math_random_int"] = function (block) {
  Blockly["Python"].imports_["import_random"] = "import random";

  const start =
    Blockly["Python"].valueToCode(
      block,
      "FROM",
      Blockly["Python"].ORDER_NONE
    ) || "0";

  const finish =
    Blockly["Python"].valueToCode(
      block,
      "TO",
      Blockly["Python"].ORDER_NONE
    ) || "1";

  // Python's random.randint handles cases where start > finish internally
  const code = `random.randint(${start}, ${finish})`;

  return [code, Blockly["Python"].ORDER_FUNCTION_CALL];
};


Blockly["Arduino"]["string_to_number"] = function (block: Block) {
  Blockly["Arduino"].functionNames_["parseDouble"] =
    "\ndouble parseDouble(String num) {\n" +
    "\t // Use num.toDouble() instead of this.  Doing this because of arduino is compiling on a linux server.  \n" +
    "\tchar str[40];\n" +
    "\tnum.toCharArray(str, num.length() + 1);\n" +
    "\treturn atof(str);\n" +
    "}\n";

  const string = Blockly["Arduino"].valueToCode(
    block,
    "VALUE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return ["parseDouble(" + string + ")", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["string_to_number"] = function (block) {
  const string = Blockly["Python"].valueToCode(
    block,
    "VALUE",
    Blockly["Python"].ORDER_ATOMIC
  ) || "''";

  const code = `float(${string} if ${string}.replace('.','',1).isdigit() else 0)`;
  return [code, Blockly["Python"].ORDER_FUNCTION_CALL];
};

