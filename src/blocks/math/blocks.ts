import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.defineBlocksWithJsonArray([
  {
    type: "string_to_number",
    message0: "Text to Number %1",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "String",
      },
    ],
    output: "Number",
    colour: COLOR_THEME.VALUES,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "math_number_property",
    message0: "%1 %2",
    args0: [
      {
        type: "input_value",
        name: "NUMBER_TO_CHECK",
        check: "Number",
      },
      {
        type: "field_dropdown",
        name: "PROPERTY",
        options: [
          ["%{BKY_MATH_IS_EVEN}", "EVEN"],
          ["%{BKY_MATH_IS_ODD}", "ODD"],
          ["%{BKY_MATH_IS_POSITIVE}", "POSITIVE"],
          ["%{BKY_MATH_IS_NEGATIVE}", "NEGATIVE"],
          ["%{BKY_MATH_IS_DIVISIBLE_BY}", "DIVISIBLE_BY"],
        ],
      },
    ],
    inputsInline: true,
    output: "Boolean",
    style: "math_blocks",
    tooltip: "%{BKY_MATH_IS_TOOLTIP}",
    mutator: "math_is_divisibleby_mutator",
  },
]);
