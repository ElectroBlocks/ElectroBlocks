import { VARIABLE_TYPES } from "../../core/blockly/constants/variables";
import Blockly from "blockly";
import { stepSerialBegin } from "../message/generators";

Blockly["Arduino"]["debug_block"] = function (block) {
  stepSerialBegin();

  Blockly["Arduino"].setupCode_["debug_clean_pipes"] =
    "\tdelay(200); // to prevent noise after uploading code \n";

  Blockly["Arduino"].setupCode_[
    "debug_wait_til_ok"
  ] = `while(Serial.readStringUntil('|').indexOf("START_DEBUG") == -1) {
      Serial.println("C_D_B_C_D_B_C_D_B_C_D_B_C_D_B_");
      delay(100);
  }\n\n`;

  Blockly["Arduino"].functionNames_["double_to_string_debug"] =
    createDoubleToStringCFunc();

  Blockly["Arduino"].functionNames_["color_struct_string"] = colorFunction();

  for (let i = 0; i < VARIABLE_TYPES.length; i += 1) {
    Blockly["Arduino"].functionNames_[
      "print_array_" + VARIABLE_TYPES[i].replace(" ", "")
    ] = createPrintArrayFuncInC(VARIABLE_TYPES[i].replace(" ", "")) + "\n\n";
  }

  let debugFunction =
    "\n\nvoid debug(String blockNumber) { \n" +
    "\t\tif(stopDebugging) {\n" +
    "\t\t\treturn; \n" +
    "\t\t}\n" +
    '\t\tString stopDebug = ""; \n';

  debugFunction += createDebugVariable();

  debugFunction +=
    '\t\tSerial.println("DEBUG_BLOCK_" + blockNumber);\n\t\tdelay(400);\n\n';

  debugFunction +=
    '\t\twhile (stopDebug != "continue_debug" && !stopDebugging) { \n' +
    "\t\t\tstopDebug = Serial.readStringUntil('|'); \n" +
    '\t\t\tif (stopDebug == "stop_debug") { \n' +
    "\t\t\t\tstopDebugging = true; \n" +
    "\t\t\t} \n" +
    "\t\t\tdelay(1000);  \n" +
    "\t\t}\n";

  debugFunction += "}\n";

  Blockly["Arduino"].functionNames_["debug_function"] = debugFunction;

  return 'debug("' + block.id + '"); \n';
};

export function createDebugVariable() {
  let debugString = "";

  const allVariables = Blockly.getMainWorkspace().getAllVariables();

  for (let i = 0; i < allVariables.length; i += 1) {
    // TODO FIGURE OUT ACTUAL VARIABLE NAME
    const actualVariableName = Blockly["Arduino"].variableDB_.getName(
      allVariables[i].getId()
    );
    if (VARIABLE_TYPES.indexOf(allVariables[i].type) > -1) {
      debugString +=
        '\t\tSerial.println("**(|)' +
        actualVariableName +
        "_|_" +
        allVariables[i].type +
        '_|_" +';

      if (allVariables[i].type === "Number") {
        debugString += "double2string(" + actualVariableName + ", 5));\n";
        continue;
      }

      if (allVariables[i].type === "Colour") {
        debugString += "colorToString(" + actualVariableName + "));\n";
        continue;
      }

      if (allVariables[i].type === "Boolean") {
        debugString +=
          (actualVariableName ? 'String("true")' : 'String("false")') + ");\n";
        continue;
      }

      debugString += "String(" + actualVariableName + ")); \n";
      continue;
    }

    let functionTypeName = allVariables[i].type.replace("List ", "");

    if (functionTypeName === "Colour") {
      functionTypeName = "RGB";
    } else if (functionTypeName === "Number") {
      functionTypeName = "double";
    } else if (functionTypeName === "Boolean") {
      functionTypeName = "boolean";
    }

    debugString +=
      '\t\tSerial.println("**(|)' +
      allVariables[i].name +
      "_|_" +
      allVariables[i].type +
      '_|_" +' +
      "printArray" +
      functionTypeName +
      "(" +
      actualVariableName +
      "," +
      getArrayVariableSize(allVariables[i]) +
      ")); \n\t\tdelay(400);\n";
  }

  return debugString;
}

function getArrayVariableSize(variable) {
  const variableId = variable.getId();
  let blockType = "";
  if (variable.type === "List String") {
    blockType = "create_list_string_block";
  } else if (variable.type === "List Number") {
    blockType = "create_list_number_block";
  } else if (variable.type === "List Boolean") {
    blockType = "create_list_boolean_block";
  } else if (variable.type === "List Colour") {
    blockType = "create_list_colour_block";
  }

  const block = Blockly.getMainWorkspace()
    .getBlocksByType(blockType, true)
    .find((block) => block.getFieldValue("VAR") === variableId);

  if (!block) {
    return 1;
  }

  return block.getFieldValue("SIZE");
}

function createPrintArrayFuncInC(type) {
  if (type === "Colour" || type === "List Colour") {
    type = "RGB";
  }

  let func =
    "String printArrayREPLATEWITHTYPE(REPLATEWITHTYPE arr[], int sizeOfArray) {\n" +
    '\t\tString returnValue = "[";\n' +
    "\t\tfor (unsigned int i = 0; i < sizeOfArray; i += 1) {\n";
  if (type.toLowerCase() === "number") {
    func += "\t\treturnValue +=  double2string(arr[i], 5);\n";
  } else if (type.toLowerCase() === "boolean") {
    func += '\t\treturnValue += arr[i] ? "true" : "false"; \n';
  } else if (type.toLowerCase() === "rgb") {
    // because we change the type so that it would match the struct RGB
    func += "\t\treturnValue += colorToString(arr[i]); \n";
  } else {
    func += "\t\treturnValue +=  String(arr[i]);\n";
  }

  func +=
    "\t\t\tif (i < sizeOfArray -1) {\n" +
    '\t\t\t\treturnValue += ",";\n' +
    "\t\t\t}\n" +
    "\t\t}\n" +
    '\t\treturnValue += "]";\n' +
    "\t\treturn returnValue;\n" +
    "}\n";

  if (type === "Number") {
    type = "double";
  } else if (type === "Boolean") {
    type = "boolean";
  }
  return func.replace(/REPLATEWITHTYPE/g, type);
}

export function createDoubleToStringCFunc() {
  return (
    " String double2string(double n, int ndec) {                         \n" +
    '\t\t String r = "";                                                 \n' +
    "\t\t int v = n;                                                     \n" +
    "\t\t r += v;     // whole number part                               \n" +
    `\t\t r += '.';   // decimal point                                   \n` +
    "\t\t int i;                                                         \n" +
    "\t\t for (i = 0; i < ndec; i++) {                                   \n" +
    "\t\t     // iterate through each decimal digit for 0..ndec          \n" +
    "\t\t     n -= v;                                                    \n" +
    "\t\t     n *= 10;                                                   \n" +
    "\t\t     v = n;                                                     \n" +
    "\t\t     r += v;                                                    \n" +
    "\t\t }                                                              \n" +
    "\t\t                                                                \n" +
    "\t\t return r;                                                      \n" +
    "}"
  );
}

export function colorFunction() {
  return (
    "String colorToString(RGB color) {\n" +
    '\treturn "{" + String(color.red) + "-" + String(color.green) + "-" + String(color.blue) + "}";\n' +
    "}\n"
  );
}
