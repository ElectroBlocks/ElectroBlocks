import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.defineBlocksWithJsonArray([
  {
    lastDummyAlign0: "RIGHT",
    type: "controls_for",
    inputsInline: true,
    message0: "loop with %1 from %2 to %3 by adding %4",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["Number"],
        defaultType: "Number",
        createNewVariable: true,
        showOnlyVariableAssigned: false,
      },
      {
        type: "input_value",
        name: "FROM",
        check: "Number",
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "TO",
        check: "Number",
        align: "RIGHT",
      },
      {
        type: "field_number",
        name: "BY",
        value: "1",
        min: 1,
        max: 200000,
      },
    ],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.CONTROL,
    helpUrl: "%{BKY_CONTROLS_FOR_HELPURL}",
    extensions: ["contextMenu_newGetVariableBlock", "controls_for_tooltip"],
  },
]);
