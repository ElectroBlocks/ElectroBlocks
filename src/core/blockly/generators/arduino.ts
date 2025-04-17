import Blockly from "blockly";
import _ from "lodash";
import { getBlockByType } from "../helpers/block.helper";

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly["Arduino"] = new Blockly.Generator("Arduino");

// Modifications for Python Generator
Blockly["Python"] = new Blockly.Generator("Python");

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly["Python"].addReservedWords(
  "import,from,time,button,red,green,blue,set_color,True,False",
  "int,float,str,bool"
);

/**
 * Order of operation ENUMs.
 *
 */
Blockly["Python"].ORDER_ATOMIC = 0; // 0 "" ...
Blockly["Python"].ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Blockly["Python"].ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Blockly["Python"].ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly["Python"].ORDER_ADDITIVE = 4; // + -
Blockly["Python"].ORDER_LOGICAL_NOT = 4.4; // !
Blockly["Python"].ORDER_SHIFT = 5; // << >>
Blockly["Python"].ORDER_MODULUS = 5.3; // %
Blockly["Python"].ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly["Python"].ORDER_EQUALITY = 7; // === !== === !==
Blockly["Python"].ORDER_BITWISE_AND = 8; // &
Blockly["Python"].ORDER_BITWISE_XOR = 9; // ^
Blockly["Python"].ORDER_BITWISE_OR = 10; // |
Blockly["Python"].ORDER_LOGICAL_AND = 11; // &&
Blockly["Python"].ORDER_LOGICAL_OR = 12; // ||
Blockly["Python"].ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly["Python"].ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly["Python"].ORDER_COMMA = 18; // ,
Blockly["Python"].ORDER_NONE = 99; // (...)

/**
 * Initialise the database of variable names for Python.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly["Python"].init = function (workspace) {
  if (!this.nameDB_) {
    this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
  } else {
    this.nameDB_.reset();
  }

  this.nameDB_.setVariableMap(workspace.getVariableMap());
  this.nameDB_.populateVariables(workspace);
  this.nameDB_.populateProcedures(workspace);

  // Create a dictionary of definitions to be printed before the code.
  Blockly["Python"].libraries_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly["Python"].setupCode_ = Object.create(null);
  Blockly["Python"].information_ = Object.create(null);

  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly["Python"].functionNames_ = Object.create(null);

  Blockly["Python"].variablesInitCode_ = "";

  if (!Blockly["Python"].variableDB_) {
    Blockly["Python"].variableDB_ = new Blockly.Names(
      Blockly["Python"].RESERVED_WORDS_
    );
  } else {
    Blockly["Python"].variableDB_.reset();
  }

  Blockly["Python"].variableDB_.setVariableMap(workspace.getVariableMap());

  const doubleVariables = workspace.getVariablesOfType("Number");
  let i = 0;
  let variableCode = "";
  for (i = 0; i < doubleVariables.length; i += 1) {
    variableCode +=
      "r = 0.0\n" +  // Modifications for Python Generator
      "g = 0.0\n" +  // Modifications for Python Generator
      "b = 0.0\n";   // Modifications for Python Generator
  }

  Blockly["Python"].variablesInitCode_ = variableCode;
};

/**
 * Prepend the generated code with the variable definitions for Python.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly["Python"].finish = function (code) {
  let libraryCode = "";
  let functionsCode = "";
  let devVariables = "";

  for (const key in Blockly["Python"].libraries_) {
    libraryCode += Blockly["Python"].libraries_[key] + "\n";
  }

  for (const key in Blockly["Python"].functionNames_) {
    functionsCode += Blockly["Python"].functionNames_[key] + "\n";
  }

  if (!_.isEmpty(Blockly["Python"].setupCode_["bluetooth_setup"])) {
    devVariables += 'bluetoothMessageDEV = ""\n';  // Modifications for Python Generator
  }

  if (!_.isEmpty(Blockly["Python"].setupCode_["serial_begin"])) {
    devVariables += 'serialMessageDEV = ""\n';  // Modifications for Python Generator
  }

  let setupCode = "";
  let setupCodeFunctionText = "";

  for (const key in Blockly["Python"].setupCode_) {
    setupCodeFunctionText += Blockly["Python"].setupCode_[key] || "";
  }

  // If the setup block does not exist and the setup function is still required.
  if (
    getBlockByType("python_setup") === undefined &&
    !_.isEmpty(Blockly["Python"].setupCode_)
  ) {
    setupCode =
      "\n# Initialise the program settings and configurations\n" +
      "def setup():\n" +
      setupCodeFunctionText +
      "\n";
  }
  // If setup block does not exist an empty setup function is required for things to compile
  else if (
    getBlockByType("python_setup") === undefined &&
    _.isEmpty(Blockly["Python"].setupCode_)
  ) {
    setupCode =
      "\n# Initialise the program settings and configurations\n" +
      "def setup():\n" +
      "\n";
  }

  code =
    devVariables +
    libraryCode +
    "\n" +
    Blockly["Python"].variablesInitCode_ +
    "\n" +
    setupCode +
    "\n" +
    code +
    "\n\n" +
    functionsCode;

  // This is so that setup functions need to run are there
  // This only happens when the setup block is in place
  code = code.replace("__REPLACE_WITH_SETUP_CODE", setupCodeFunctionText);

  // Clean up temporary data.
  delete Blockly["Python"].definitions_;
  delete Blockly["Python"].functionNames_;
  delete Blockly["Python"].variablesInitCode_;
  delete Blockly["Python"].libraries_;
  Blockly["Python"].variableDB_.reset();

  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal for Python.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code for Python.
 */
Blockly["Python"].scrubNakedValue = function (line) {
  return line + "\n";  // Modifications for Python Generator
};

/**
 * Encode a string as a properly escaped Python string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Python string.
 * @private
 */
Blockly["Python"].quote_ = function (string) {
  string = string
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/'/g, "\\'");
  return "'" + string + "'";  // Modifications for Python Generator
};

/**
 * Common tasks for generating Python from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Python code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Python code with comments and subsequent blocks added.
 * @private
 */
Blockly["Python"].scrub_ = function (block, code) {
  let commentCode = "";

  if (
    (!block.outputConnection || !block.outputConnection.targetConnection) &&
    block.nextConnection !== null
  ) {
    let comment = block.getCommentText();
    comment = comment
      ? (Blockly.utils as any).string.wrap(
          comment,
          Blockly["Python"].COMMENT_WRAP - 3
        )
      : null;
    if (comment) {
      commentCode += Blockly["Python"].prefixLines(comment + "\n", "# ");
    }

    for (let i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type === Blockly.INPUT_VALUE) {
        const childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          const comment = Blockly["Python"].allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly["Python"].prefixLines(comment, "# ");
          }
        }
      }
    }
  }

  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = nextBlock ? Blockly["Python"].blockToCode(nextBlock) : "";

  return commentCode + code + nextCode;
};
