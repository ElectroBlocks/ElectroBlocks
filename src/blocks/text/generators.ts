import Blockly from "blockly";
import type { Block } from "blockly";
import { createDoubleToStringCFunc } from "../debug/generators";

Blockly["Arduino"]["text"] = function (block: Block) {
  // Text value.
  const code =
    "String(" + Blockly["Arduino"].quote_(block.getFieldValue("TEXT")) + ")";
  return [code, Blockly["Arduino"].ORDER_ATOMIC];
};

/**
 * Enclose the provided value in 'String(...)' function.
 * Leave string literals alone.
 * @param {string} value Code evaluating to a value.
 * @return {string} Code evaluating to a string.
 */
Blockly["Arduino"].text.forceString_ = function (value) {
  if (Blockly["Arduino"].text.forceString_.strRegExp.it(value)) {
    return value;
  }
  return "String(" + value + ")";
};

/**
 * Regular expression to detect a single-quoted string literal.
 */
Blockly["Arduino"].text.forceString_.strRegExp = /^\s*'([^']|\\')*'\s*$/;

Blockly["Arduino"]["text_join"] = function (block: Block | any) {
  if (block.itemCount_ === 0) {
    return ['""', Blockly["Arduino"].ORDER_ATOMIC];
  }

  if (block.itemCount_ === 1) {
    const element =
      Blockly["Arduino"].valueToCode(
        block,
        "ADD0",
        Blockly["Arduino"].ORDER_NONE
      ) || '""';
    return [
      Blockly["Arduino"].text.forceString_(element),
      Blockly["Arduino"].ORDER_ATOMIC,
    ];
  }

  const parts = [];

  for (let i = 0; i < block.itemCount_; i += 1) {
    const part = Blockly["Arduino"].valueToCode(
      block,
      "ADD" + i,
      Blockly["Arduino"].ORDER_COMMA
    );
    if (part.length > 0) {
      parts.push(part);
    }
  }

  const code = parts.join(" + ");

  return [code, Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["text_length"] = function (block: Block | any) {
  Blockly["Arduino"].functionNames_["textLength"] =
    "double textLength(String str) {\n" +
    "\t return (double)str.length(); \n" +
    "}\n";

  const str = Blockly["Arduino"].valueToCode(
    block,
    "VALUE",
    Blockly["Arduino"].ORDER_COMMA
  );

  return ["textLength(" + str + ")", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["text_isEmpty"] = function (block: Block | any) {
  Blockly["Arduino"].functionNames_["textLength"] =
    "double textLength(String str) {\n" +
    "\t return (double)str.length(); \n" +
    "}\n";

  const str = Blockly["Arduino"].valueToCode(
    block,
    "VALUE",
    Blockly["Arduino"].ORDER_COMMA
  );

  return ["(textLength(" + str + ") > 0)", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["number_to_string"] = function (block: Block | any) {
  Blockly["Arduino"].functionNames_["double_to_string_debug"] =
    createDoubleToStringCFunc();

  const numberOfDecimals = block.getFieldValue("PRECISION");
  const number = Blockly["Arduino"].valueToCode(
    block,
    "NUMBER",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  return [
    "double2string(" + number + ", " + numberOfDecimals + ")",
    Blockly["Arduino"].ORDER_NONE,
  ];
};

Blockly["Arduino"]["text_changeCase"] = function (block: Block | any) {
  Blockly["Arduino"].functionNames_["upperCaseString"] =
    "\nString upperCaseString(String str) {\n" +
    "\tstr.toUpperCase(); \n" +
    "\treturn str;\n" +
    "}\n";

  Blockly["Arduino"].functionNames_["lowerCaseString"] =
    "\nString lowerCaseString(String str) {\n" +
    "\tstr.toLowerCase(); \n" +
    "\treturn str;\n" +
    "}\n";

  const transformType = block.getFieldValue("CASE");
  const text = Blockly["Arduino"].valueToCode(
    block,
    "TEXT",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  if (transformType === "UPPERCASE") {
    return ["upperCaseString(" + text + ")", Blockly["Arduino"].ORDER_ATOMIC];
  } else {
    return ["lowerCaseString(" + text + ")", Blockly["Arduino"].ORDER_ATOMIC];
  }
};

Blockly["Arduino"]["parse_string_block"] = function (block: Block | any) {
  Blockly["Arduino"].functionNames_["text_get_part_of_string"] =
    "\nString getParseValue(String data, char separator, int index) { \n" +
    "\tint found = 0;" +
    "\tint strIndex[] = {0, -1}; \n" +
    "\tint maxIndex = data.length()-1; \n" +
    "\tfor(int i=0; i<=maxIndex && found<=index; i++){   \n" +
    "\t    if(data.charAt(i) == separator || i == maxIndex){    \n" +
    "\t        found++;                      \n" +
    "\t        strIndex[0] = strIndex[1]+1;    \n" +
    "\t        strIndex[1] = (i == maxIndex) ? i+1 : i;    \n" +
    "\t    }                            \n" +
    "\t}                     \n" +
    '\treturn found>index ? data.substring(strIndex[0], strIndex[1]) : ""; \n' +
    "}\n";

  const text = Blockly["Arduino"].valueToCode(
    block,
    "VALUE",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const delimiter = "'" + block.getFieldValue("DELIMITER") + "'";
  let position = +Blockly["Arduino"].valueToCode(
    block,
    "POSITION",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  position = Math.abs(position);
  position = position > 0 ? position - 1 : position;

  return [
    "getParseValue(" + text + ", " + delimiter + ", " + position + ")",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};
