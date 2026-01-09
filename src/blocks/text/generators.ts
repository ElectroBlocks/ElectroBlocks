import Blockly from "blockly";
import type { Block } from "blockly";
import { createDoubleToStringCFunc } from "../debug/generators";
import * as _ from "lodash";

Blockly["Arduino"]["text"] = function (block: Block) {
  // Text value.
  const code =
    "String(" + Blockly["Arduino"].quote_(block.getFieldValue("TEXT")) + ")";
  return [code, Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["text"] = function (block: Block)  {
  const code = `"${block.getFieldValue("TEXT")}"`;
  return [code, Blockly["Python"].ORDER_ATOMIC];
}

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

Blockly["Python"].text.forceString_ = function (value) {
  if (Blockly["Python"].text.forceString_.strRegExp.test(value)) {
    return value;
  }
  return `str(${value})`;
};
/**
 * Regular expression to detect a single-quoted string literal.
 */
Blockly["Arduino"].text.forceString_.strRegExp = /^\s*'([^']|\\')*'\s*$/;
Blockly["Python"].text.forceString_.strRegExp = /^(['"])(?:\\.|[^\\])*?\1$/;

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

Blockly["Python"]["text_join"] = function (block) {
  if (block.itemCount_ === 0) {
    return ['""', Blockly["Python"].ORDER_ATOMIC];
  }

  if (block.itemCount_ === 1) {
    const element = Blockly["Python"].valueToCode(
      block,
      "ADD0",
      Blockly["Python"].ORDER_NONE
    ) || '""';
    return [
      Blockly["Python"].text.forceString_(element),
      Blockly["Python"].ORDER_ATOMIC,
    ];
  }

  const parts = [];

  for (let i = 0; i < block.itemCount_; i++) {
    const part = Blockly["Python"].valueToCode(
      block,
      "ADD" + i,
      Blockly["Python"].ORDER_NONE
    );
    if (part && part.length > 0) {
      parts.push(Blockly["Python"].text.forceString_(part));
    }
  }

  const code = parts.join(" + ");
  return [code, Blockly["Python"].ORDER_ADDITIVE];
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

Blockly["Python"]["text_length"] = function (block) {
  const str = Blockly["Python"].valueToCode(
    block,
    "VALUE",
    Blockly["Python"].ORDER_NONE
  ) || '""';

  return [`len(${str})`, Blockly["Python"].ORDER_FUNCTION_CALL];
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

  return ["(textLength(" + str + ") == 0)", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["text_isEmpty"] = function (block) {
  const str = Blockly["Python"].valueToCode(
    block,
    "VALUE",
    Blockly["Python"].ORDER_NONE
  ) || '""';

  return [`(len(${str}) == 0)`, Blockly["Python"].ORDER_COMPARISON];
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

Blockly["Python"]["number_to_string"] = function (block) {
  const numberOfDecimals = block.getFieldValue("PRECISION");
  const number = Blockly["Python"].valueToCode(
    block,
    "NUMBER",
    Blockly["Python"].ORDER_NONE
  ) || "0";

  const code = `f"{${number}:.${numberOfDecimals}f}"`;

  return [code, Blockly["Python"].ORDER_ATOMIC];
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

Blockly["Python"]["text_changeCase"] = function (block) {
  const transformType = block.getFieldValue("CASE");
  const text = Blockly["Python"].valueToCode(
    block,
    "TEXT",
    Blockly["Python"].ORDER_FUNCTION_CALL
  ) || '""';

  if (transformType === "UPPERCASE") {
    return [`${text}.upper()`, Blockly["Python"].ORDER_FUNCTION_CALL];
  } else {
    return [`${text}.lower()`, Blockly["Python"].ORDER_FUNCTION_CALL];
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
  let position = Blockly["Arduino"].valueToCode(
    block,
    "POSITION",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  if (!isNaN(position)) {
    position = Math.round(position);
    position = Math.abs(position);
    position = position > 0 ? position - 1 : position;
  }

  return [
    "getParseValue(" + text + ", " + delimiter + ", " + position + ")",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

// Blockly["Python"]["parse_string_block"] = function (block) {
//   const text = Blockly["Python"].valueToCode(
//     block,
//     "VALUE",
//     Blockly["Python"].ORDER_NONE
//   ) || '""';

//   const delimiter = Blockly["Python"].quote_(block.getFieldValue("DELIMITER"));
//   let position = Blockly["Python"].valueToCode(
//     block,
//     "POSITION",
//     Blockly["Python"].ORDER_NONE
//   ) || "0";

//   // Adjust to zero-based index like in the Arduino version
//   position = `max(0, (${position}) - 1)`;

//   // Expanded multi-line version using triple quotes for readability
//   const code = `(lambda text=${text}, delim=${delimiter}, pos=${position}: 
//     parts = text.split(delim)
//     if 0 <= pos < len(parts):
//         return parts[pos]
//     else:
//         return ""
// )()`;  // Immediately invoke the lambda function

//   return [code, Blockly["Python"].ORDER_NONE];
// };

Blockly["Python"]["parse_string_block"] = function (block) {
  Blockly["Python"].functionNames_[
    "parse_string_block"
  ] = `def get_parse_value(data: str, separator: str, index: int, default: str = "") -> str:
    parts = data.split(separator)
    return parts[index] if 0 <= index < len(parts) else default
`;
  const text = Blockly["Python"].valueToCode(
    block,
    "VALUE",
    Blockly["Python"].ORDER_NONE
  ) || '""';
  const delimiter = Blockly["Python"].quote_(block.getFieldValue("DELIMITER"));
  let position = Blockly["Python"].valueToCode(
    block,
    "POSITION",
    Blockly["Python"].ORDER_NONE
  ) || "0";
  // Adjust to zero-based index like in the Arduino version
  position = `max(0, (${position}) - 1)`;
  // Expanded multi-line version using triple quotes for readability
  const code = `get_parse_value(${text}, ${delimiter}, ${position})`;
  return [code, Blockly["Python"].ORDER_NONE];
};