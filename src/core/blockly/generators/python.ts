import Blockly, { Block } from "blockly";
import _ from "lodash";
import { getBlockByType } from "../helpers/block.helper";

// Python Code generator
Blockly["Python"] = new Blockly.Generator("Python");

// Python Equivalent ReservedWords
Blockly["Python"].addReservedWords(
  // Python keywords
  "False,None,True,and,as,assert,async,await,break,class,continue,def," +
    "del,elif,else,except,finally,for,from,global,if,import,in,is,lambda," +
    "nonlocal,not,or,pass,raise,return,try,while,with,yield," +
    // Common builtins
    "abs,all,any,bin,bool,bytearray,bytes,chr,complex,dict,dir,divmod," +
    "enumerate,eval,exec,filter,float,format,frozenset,getattr,globals," +
    "hasattr,hash,hex,id,input,int,isinstance,issubclass,iter,len,list,locals," +
    "map,max,memoryview,min,next,object,oct,open,ord,pow,print,property,range," +
    "repr,reversed,round,set,setattr,slice,sorted,staticmethod,str,sum,super," +
    "tuple,type,vars,zip," +
    // MicroPython specific
    "board,digitalio,analogio,time,neopixel,servo,busio,math,random," +
    "pin,pin_in,pin_out,analog_read,analog_write,digital_read,digital_write," +
    "sleep,sleep_ms,ticks_ms,ticks_us," +
    // Constants commonly used in Arduino that might be used in Python too
    "HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false"
);

  // Python Order of Operation
  // https://neil.fraser.name/blockly/custom-blocks/operator-precedence
  // Much simpler than JavaScript, but here for reference.
  // https://docs.python.org/3/reference/expressions.html#operator-precedence

  Blockly["Python"].ORDER_ATOMIC = 0; // 0 "" 1234 'abc' True False None
  Blockly["Python"].ORDER_COLLECTION = 1; // tuples, lists, dictionaries
  Blockly["Python"].ORDER_STRING_CONVERSION = 1; // `expression...`
  Blockly["Python"].ORDER_MEMBER = 2; // . []
  Blockly["Python"].ORDER_FUNCTION_CALL = 2; // ()
  Blockly["Python"].ORDER_EXPONENTIATION = 3; // **
  Blockly["Python"].ORDER_UNARY_SIGN = 4; // + -
  Blockly["Python"].ORDER_BITWISE_NOT = 4; // ~
  Blockly["Python"].ORDER_MULTIPLICATIVE = 5; // * / // %
  Blockly["Python"].ORDER_ADDITIVE = 6; // + -
  Blockly["Python"].ORDER_BITWISE_SHIFT = 7; // << >>
  Blockly["Python"].ORDER_BITWISE_AND = 8; // &
  Blockly["Python"].ORDER_BITWISE_XOR = 9; // ^
  Blockly["Python"].ORDER_BITWISE_OR = 10; // |
  Blockly["Python"].ORDER_COMPARISON = 11; // in, not in, is, is not, <, <=, >, >=, <>, !=, ==
  Blockly["Python"].ORDER_LOGICAL_NOT = 12; // not
  Blockly["Python"].ORDER_LOGICAL_AND = 13; // and
  Blockly["Python"].ORDER_LOGICAL_OR = 14; // or
  Blockly["Python"].ORDER_CONDITIONAL = 15; // if else
  Blockly["Python"].ORDER_LAMBDA = 16; // lambda
  Blockly["Python"].ORDER_ASSIGNMENT = 17; // =
  Blockly["Python"].ORDER_NONE = 99; // (...)

  // Bug fixes
  Blockly["Python"].ORDER_MODULUS ??= 5;

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
    Blockly["Python"].imports_ = Object.create(null);
    Blockly["Python"].definitions_ = Object.create(null);

    // creates a list of code to be setup before the setup block
    Blockly["Python"].setupCode_ = Object.create(null);
    Blockly["Python"].information_ = Object.create(null);

    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions).
    Blockly["Python"].functionNames_ = Object.create(null);

    Blockly["Python"].variablesInitCode_ = "";

    this.imports_["electroblocks"] = "#Import ElectroBlocks library\nfrom electroblocks import ElectroBlocks";
    this.setupCode_[
      "eb_instance"
    ] = `eb = ElectroBlocks() # Create an instance of the ElectroBlocks class\n`;

    if (!Blockly["Python"].variableDB_) {
      Blockly["Python"].variableDB_ = new Blockly.Names(
        Blockly["Python"].RESERVED_WORDS_
      );
    } else {
      Blockly["Python"].variableDB_.reset();
    }

    Blockly["Python"].variableDB_.setVariableMap(workspace.getVariableMap());

    // No Variable Declaration for Double in Python due to dynamic typing

    const numberVariables = workspace.getVariablesOfType("Number");
    let i = 0;
    let variableCode = "";
    if (workspace.getAllVariables().length > 0) {
      variableCode += "\n# Variable Declaration\n";
    }
    for (i = 0; i < numberVariables.length; i++) {
      variableCode +=
        Blockly["Python"].getVariableName(numberVariables[i].getId()) +
        " = 0\n\n";
    }

    const stringVariables = workspace.getVariablesOfType("String");
    for (i = 0; i < stringVariables.length; i++) {
      variableCode +=
        Blockly["Python"].getVariableName(stringVariables[i].getId()) +
        ' = ""\n\n';
    }

    const booleanVariables = workspace.getVariablesOfType("Boolean");
    for (i = 0; i < booleanVariables.length; i++) {
      variableCode +=
        Blockly["Python"].getVariableName(booleanVariables[i].getId()) +
        " = False\n\n";
    }

    const colourVariables = workspace.getVariablesOfType("Colour");
    for (i = 0; i < colourVariables.length; i++) {
      variableCode +=
        Blockly["Python"].getVariableName(colourVariables[i].getId()) +
        " = RGB(0, 0, 0)\n\n";
    }

    Blockly["Python"].variablesInitCode_ = variableCode;
  };

  Blockly["Python"].finish = function (code) {
    let libraryCode = ``;
    let functionsCode = "";
    let devVariables = "";
    let definitionsCode = "";

    for (const key in Blockly["Python"].imports_) {
      libraryCode += Blockly["Python"].imports_[key] + "\n";
    }

    for (const key in Blockly["Python"].functionNames_) {
      functionsCode += Blockly["Python"].functionNames_[key] + "\n";
    }

    for (const key in Blockly["Python"].definitions_) {
      definitionsCode += Blockly["Python"].definitions_[key] + "\n";
    }

    if (!_.isEmpty(Blockly["Python"].setupCode_["bluetooth_setup"])) {
      devVariables += 'bluetoothMessageDev = ""\n';
    }

    if (!_.isEmpty(Blockly["Python"].setupCode_["serial_begin"])) {
      devVariables += 'serialMessageDev = ""\n';
    }

    if (!_.isEmpty(Blockly["Python"].functionNames_["do"]))
      devVariables += "stopDebugging = False\n";

    let setupCode = "";
    let setupCodeFunctionText = "";

    for (const key in Blockly["Python"].setupCode_) {
      setupCodeFunctionText += Blockly["Python"].setupCode_[key] || "";
    }

    if (!_.isEmpty(Blockly["Python"].setupCode_)) {
      setupCode =
        "\n# Initialise the program settings and configurations\n" +
        setupCodeFunctionText +
        "\n";
    }

    let completeCode =
      devVariables +
      libraryCode +
      definitionsCode +
      (functionsCode.length > 0 ? "# Function Code\n\n" : "") +
      functionsCode +
      Blockly["Python"].variablesInitCode_ +
      setupCode +
      "\n" +
      code +
      "\n\n";

    completeCode = completeCode.replace(
      "__REPLACE_WITH_SETUP_CODE",
      setupCodeFunctionText
    );

    delete Blockly["Python"].definitions_;
    delete Blockly["Python"].functionNames_;
    delete Blockly["Python"].variablesInitCode_;
    delete Blockly["Python"].imports_;
    Blockly["Python"].variableDB_.reset();

    return completeCode;
  };

// Don't know if this is needed but here nevertheless
Blockly["Python"].scrubNakedValue = function (line) {
  return line + "\n";
};


// This supposedly has the same functionality as C, but I'm not sure
// used AI for this, so let me know if it's wrong

/**
 * Encode a string as a properly escaped Python string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Python string.
 * @private
 */
Blockly["Python"].quote_ = function (string) {
  // Check if the string contains both single and double quotes
  const hasSingle = string.includes("'");
  const hasDouble = string.includes('"');
  const hasNewlines = string.includes('\n');
  
  // For multi-line strings, prefer triple quotes
  if (hasNewlines) {
    // If string has triple quotes inside, escape them
    if (string.includes('"""')) {
      string = string.replace(/"""/g, '\\"\\"\\"');
    }
    return '"""' + string + '"""';
  }
  
  // For strings with both quote types, use triple quotes or escape
  if (hasSingle && hasDouble) {
    // Option 1: Use triple double quotes
    return '"""' + string + '"""';
    
    // Alternative: Use double quotes and escape them
    // string = string.replace(/"/g, '\\"');
    // return '"' + string + '"';
  }
  
  // If string has double quotes, use single quotes
  if (hasDouble) {
    return "'" + string + "'";
  }
  
  // Default to double quotes
  return '"' + string + '"';
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

  // Only collect comments for blocks that aren't inline.
  // Do not collect comments for certain block types
  if (
    (!block.outputConnection || !block.outputConnection.targetConnection) &&
    block.nextConnection !== null
  ) {
    // Collect comment for this block.
    let comment =
      [
        "release_button",
        "led",
        "delay_block",
        "set_color_led",
        "set_simple_color_led",
        "rotate_servo",
      ].includes(block.type) == false
        ? block.getCommentText()
        : null;
    //@ts-ignore
    comment = comment
      ? (Blockly.utils as any).string.wrap(
          comment,
          Blockly["Python"].COMMENT_WRAP - 3
        )
      : null;
    if (comment) {
      if (block.getProcedureDef) {
        // Use docstring for function comments - Python style
        commentCode +=
          '"""\n' +
          Blockly["Python"].prefixLines(comment + "\n", "") +
          '"""\n';
      } else {
        // Single line comments use # in Python
        commentCode += Blockly["Python"].prefixLines(comment + "\n", "# ");
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
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
  const nextCode = Blockly["Python"].blockToCode(nextBlock);
  return code + nextCode;
};
