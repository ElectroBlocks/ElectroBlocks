import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.defineBlocksWithJsonArray([
  {
    type: "create_list_number_block",
    message0: "Create a list named %1 that stores %2 numbers.",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        defaultType: "List Number",
        variableTypes: ["List Number"],
        showOnlyVariableAssigned: true,
        createNewVariable: false,
      },
      {
        type: "field_number",
        name: "SIZE",
        value: 2,
        min: 1,
        max: 20000,
      },
    ],
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "create_list_string_block",
    message0: "Create a list named %1 that stores %2 text.",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        defaultType: "List String",
        variableTypes: ["List String"],
        showOnlyVariableAssigned: true,
        createNewVariable: false,
      },
      {
        type: "field_number",
        name: "SIZE",
        value: 2,
        min: 1,
        max: 20000,
      },
    ],
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "create_list_colour_block",
    message0: "Create a list named %1 that stores %2 colors.",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        defaultType: "List Colour",
        variableTypes: ["List Colour"],
        showOnlyVariableAssigned: true,
        createNewVariable: false,
      },
      {
        type: "field_number",
        name: "SIZE",
        value: 2,
        min: 1,
        max: 20000,
      },
    ],
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "create_list_boolean_block",
    message0: "Create a list named %1 that stores %2 booleans.",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        defaultType: "List Boolean",
        variableTypes: ["List Boolean"],
        showOnlyVariableAssigned: true,
        createNewVariable: false,
      },
      {
        type: "field_number",
        name: "SIZE",
        value: 2,
        min: 1,
        max: 20000,
      },
    ],
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },

  // NUMBER LIST
  {
    type: "set_number_list_block",
    message0: "Store a number  %1 in list %2 at position %3 %4",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "Number",
        align: "RIGHT",
      },
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List Number"],
        defaultType: "List Number",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "get_number_from_list",
    message0: "Get a number from list at  %1 at position %2",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List Number"],
        defaultType: "List Number",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: false,
    output: "Number",
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },
  // STRING LIST
  {
    type: "set_string_list_block",
    message0: "Store a text block %1 in list %2 at position %3 %4",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "String",
        align: "RIGHT",
      },
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List String"],
        defaultType: "List String",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "get_string_from_list",
    message0: "Get a text block from list at  %1 at position %2",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List String"],
        defaultType: "List String",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: false,
    output: "String",
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },

  // Boolean List
  {
    type: "set_boolean_list_block",
    message0: "Store a boolean (true/false) %1 in list %2 at position %3 %4",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "Boolean",
        align: "RIGHT",
      },
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List Boolean"],
        defaultType: "List Boolean",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "get_boolean_from_list",
    message0: "Get a boolean (true/false) from list at  %1 at position %2",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List Boolean"],
        defaultType: "List Boolean",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: false,
    output: "Boolean",
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },

  // Colour List
  {
    type: "set_colour_list_block",
    message0: "Store a color %1 in list %2 at position %3 %4",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "Colour",
        align: "RIGHT",
      },
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List Colour"],
        defaultType: "List Colour",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "get_colour_from_list",
    message0: "Get a color from list at  %1 at position %2",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: null,
        variableTypes: ["List Colour"],
        defaultType: "List Colour",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
      },
    ],
    inputsInline: false,
    output: "Colour",
    colour: COLOR_THEME.DATA,
    tooltip: "",
    helpUrl: "",
  },
]);
