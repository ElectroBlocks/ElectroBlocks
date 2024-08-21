import Blockly from "blockly";
import _ from "lodash";
import { getBlockByType } from "../helpers/block.helper";

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly["Arduino"] = new Blockly.Generator("Arduino");

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly["Arduino"].addReservedWords(
  // http://arduino.cc/en/Reference/HomePage
  "setup,loop,if,else,for,switch,case,while," +
    "do,break,continue,return,goto,define,include," +
    "HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false," +
    "interger, constants,floating,point,void,bookean,char," +
    "unsigned,byte,int,word,long,float,double,string,String,array," +
    "static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead," +
    "analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn," +
    "pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain," +
    "map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead," +
    "bitWrite,bitSet,bitClear,ultraSonicDistance,parseDouble,setNeoPixelColor," +
    "bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts",
  "short",
  "isBtnPressed"
);

/**
 * Order of operation ENUMs.
 *
 */
Blockly["Arduino"].ORDER_ATOMIC = 0; // 0 "" ...
Blockly["Arduino"].ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Blockly["Arduino"].ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Blockly["Arduino"].ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly["Arduino"].ORDER_ADDITIVE = 4; // + -
Blockly["Arduino"].ORDER_LOGICAL_NOT = 4.4; // !
Blockly["Arduino"].ORDER_SHIFT = 5; // << >>
Blockly["Arduino"].ORDER_MODULUS = 5.3; // %
Blockly["Arduino"].ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly["Arduino"].ORDER_EQUALITY = 7; // === !== === !==
Blockly["Arduino"].ORDER_BITWISE_AND = 8; // &
Blockly["Arduino"].ORDER_BITWISE_XOR = 9; // ^
Blockly["Arduino"].ORDER_BITWISE_OR = 10; // |
Blockly["Arduino"].ORDER_LOGICAL_AND = 11; // &&
Blockly["Arduino"].ORDER_LOGICAL_OR = 12; // ||
Blockly["Arduino"].ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly["Arduino"].ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly["Arduino"].ORDER_COMMA = 18; // ,
Blockly["Arduino"].ORDER_NONE = 99; // (...)

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly["Arduino"].init = function (workspace) {
  if (!this.nameDB_) {
    this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
  } else {
    this.nameDB_.reset();
  }

  this.nameDB_.setVariableMap(workspace.getVariableMap());
  this.nameDB_.populateVariables(workspace);
  this.nameDB_.populateProcedures(workspace);

  // Create a dictionary of definitions to be printed before the code.
  Blockly["Arduino"].libraries_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly["Arduino"].setupCode_ = Object.create(null);
  Blockly["Arduino"].information_ = Object.create(null);

  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly["Arduino"].functionNames_ = Object.create(null);

  Blockly["Arduino"].variablesInitCode_ = "";

  if (!Blockly["Arduino"].variableDB_) {
    Blockly["Arduino"].variableDB_ = new Blockly.Names(
      Blockly["Arduino"].RESERVED_WORDS_
    );
  } else {
    Blockly["Arduino"].variableDB_.reset();
  }

  Blockly["Arduino"].variableDB_.setVariableMap(workspace.getVariableMap());

  // We don't have developer variables for now
  // // Add developer variables (not created or named by the user).
  // var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  // for (var i = 0; i < devVarList.length; i++) {
  //     defvars.push(Blockly['Arduino'].variableDB_.getName(devVarList[i],
  //         Blockly.Names.DEVELOPER_VARIABLE_TYPE));
  // }

  const doubleVariables = workspace.getVariablesOfType("Number");
  let i = 0;
  let variableCode = "";
  for (i = 0; i < doubleVariables.length; i += 1) {
    variableCode +=
      "double " +
      Blockly["Arduino"].getVariableName(doubleVariables[i].getId()) +
      " = 0; \n\n";
  }

  const stringVariables = workspace.getVariablesOfType("String");
  for (i = 0; i < stringVariables.length; i += 1) {
    variableCode +=
      "String " +
      Blockly["Arduino"].getVariableName(stringVariables[i].getId()) +
      ' = ""; \n\n';
  }

  const booleanVariables = workspace.getVariablesOfType("Boolean");
  for (i = 0; i < booleanVariables.length; i += 1) {
    variableCode +=
      "boolean " +
      Blockly["Arduino"].getVariableName(booleanVariables[i].getId()) +
      " = false; \n\n";
  }

  const colourVariables = workspace.getVariablesOfType("Colour");
  for (i = 0; i < colourVariables.length; i += 1) {
    variableCode +=
      "struct RGB " +
      Blockly["Arduino"].getVariableName(colourVariables[i].getId()) +
      " = {0, 0, 0}; \n\n";
  }

  Blockly["Arduino"].variablesInitCode_ = variableCode;
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly["Arduino"].finish = function (code) {
  let libraryCode = "";
  let functionsCode = "";
  let devVariables = "";

  for (const key in Blockly["Arduino"].libraries_) {
    libraryCode += Blockly["Arduino"].libraries_[key] + "\n";
  }

  for (const key in Blockly["Arduino"].functionNames_) {
    functionsCode += Blockly["Arduino"].functionNames_[key] + "\n";
  }

  if (!_.isEmpty(Blockly["Arduino"].setupCode_["bluetooth_setup"])) {
    devVariables += 'String bluetoothMessageDEV = ""; \n';
  }

  if (!_.isEmpty(Blockly["Arduino"].setupCode_["serial_begin"])) {
    devVariables += 'String serialMessageDEV = ""; \n';
  }

  if (!_.isEmpty(Blockly["Arduino"].functionNames_["double_to_string_debug"])) {
    devVariables += "boolean stopDebugging = false; \n";
  }

  let setupCode = "";
  let setupCodeFunctionText = "";

  for (const key in Blockly["Arduino"].setupCode_) {
    setupCodeFunctionText += Blockly["Arduino"].setupCode_[key] || "";
  }

  // If the setup block does not exist and the setup function is still required.
  if (
    getBlockByType("arduino_setup") === undefined &&
    !_.isEmpty(Blockly["Arduino"].setupCode_)
  ) {
    setupCode = "\nvoid setup() { \n" + setupCodeFunctionText + "\n}\n";
  }
  // If setup block does not exist an empty setup function is required for things to compile
  else if (
    getBlockByType("arduino_setup") === undefined &&
    _.isEmpty(Blockly["Arduino"].setupCode_)
  ) {
    setupCode = "\nvoid setup() { \n\n}\n";
  }
  // Convert the definitions dictionary into a list.
  code =
    devVariables +
    libraryCode +
    "\n" +
    Blockly["Arduino"].variablesInitCode_ +
    "\n" +
    functionsCode +
    "\n" +
    setupCode +
    "\n" +
    code;

  // This is so that setup functions need to run are there
  // This only happens when the setup block is in place
  code = code.replace("__REPLACE_WITH_SETUP_CODE", setupCodeFunctionText);

  // Clean up temporary data.
  delete Blockly["Arduino"].definitions_;
  delete Blockly["Arduino"].functionNames_;
  delete Blockly["Arduino"].variablesInitCode_;
  delete Blockly["Arduino"].libraries_;
  Blockly["Arduino"].variableDB_.reset();

  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly["Arduino"].scrubNakedValue = function (line) {
  return line + ";\n";
};

/**
 * Encode a string as a properly escaped Arduino string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly["Arduino"].quote_ = function (string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\\n")
    .replace(/'/g, "\\'");
  return '"' + string + '"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
Blockly["Arduino"].scrub_ = function (block, code) {
  let commentCode = "";
  // Only collect comments for blocks that aren't inline.
  // Do not collect comments for setup blocks
  if (
    (!block.outputConnection || !block.outputConnection.targetConnection) &&
    block.nextConnection !== null
  ) {
    // Collect comment for this block.
    let comment = block.getCommentText();
    //@ts-ignore
    comment = comment
      ? (Blockly.utils as any).string.wrap(
          comment,
          Blockly["Arduino"].COMMENT_WRAP - 3
        )
      : null;
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode +=
          "/**\n" +
          Blockly["Arduino"].prefixLines(comment + "\n", " * ") +
          " */\n";
      } else {
        commentCode += Blockly["Arduino"].prefixLines(comment + "\n", "// ");
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (let i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type === Blockly.INPUT_VALUE) {
        const childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          const comment = Blockly["Arduino"].allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly["Arduino"].prefixLines(comment, "// ");
          }
        }
      }
    }
  }
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = Blockly["Arduino"].blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
