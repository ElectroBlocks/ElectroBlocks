import type { WorkspaceSvg } from "blockly";
import Blockly from "blockly";
import {
  createBlock,
  connectToArduinoBlock,
} from "../../core/blockly/helpers/block.helper";
import { getVariableByName } from "../../core/blockly/helpers/variable.helper";
export const registerVariableMenu = (workspace: WorkspaceSvg) => {
  workspace.registerToolboxCategoryCallback("ELECTROBLOCKS_VARIABLES", (_) => {
    let xmlList: Element[] = [];
    const castedWorkspace = workspace as WorkspaceSvg;
    const btnNumVariable = document.createElement("button");
    btnNumVariable.setAttribute("text", "Create Number Variable");
    btnNumVariable.setAttribute("callbackKey", "CREATE_NUM_VARIABLE");
    castedWorkspace.registerButtonCallback(
      "CREATE_NUM_VARIABLE",
      function (button) {
        Blockly.Variables.createVariableButtonHandler(
          button.getTargetWorkspace(),
          createVariableBtnHanlder(
            "variables_set_number",
            "math_number",
            "NUM",
            "33"
          ),
          "Number"
        );
      }
    );

    xmlList.push(btnNumVariable);

    const btnStringVariable = document.createElement("button");

    btnStringVariable.setAttribute("text", "Create Text Variable");
    btnStringVariable.setAttribute("callbackKey", "CREATE_STRING_VARIABLE");

    castedWorkspace.registerButtonCallback(
      "CREATE_STRING_VARIABLE",
      function (button) {
        Blockly.Variables.createVariableButtonHandler(
          button.getTargetWorkspace(),
          createVariableBtnHanlder(
            "variables_set_string",
            "text",
            "TEXT",
            "abc"
          ),
          "String"
        );
      }
    );

    xmlList.push(btnStringVariable);

    const btnBoolVariable = document.createElement("button");
    btnBoolVariable.setAttribute("text", "Create Boolean Variable");
    btnBoolVariable.setAttribute("callbackKey", "CREATE_BOOLEAN_VARIABLE");

    // variables_set_colour color_picker_custom
    // createVariableBtnHanlder

    castedWorkspace.registerButtonCallback(
      "CREATE_BOOLEAN_VARIABLE",
      function (button) {
        Blockly.Variables.createVariableButtonHandler(
          button.getTargetWorkspace(),
          createVariableBtnHanlder("variables_set_boolean", "logic_boolean"),
          "Boolean"
        );
      }
    );

    xmlList.push(btnBoolVariable);

    const btnColourVariable = document.createElement("button");

    btnColourVariable.setAttribute("text", "Create Color Variable");
    btnColourVariable.setAttribute("callbackKey", "CREATE_COLOUR_VARIABLE");

    castedWorkspace.registerButtonCallback(
      "CREATE_COLOUR_VARIABLE",
      function (button) {
        Blockly.Variables.createVariableButtonHandler(
          button.getTargetWorkspace(),
          createVariableBtnHanlder(
            "variables_set_colour",
            "color_picker_custom"
          ),
          "Colour"
        );
      }
    );

    xmlList.push(btnColourVariable);

    const blockList = Blockly.Variables.flyoutCategoryBlocks(workspace);
    xmlList = xmlList.concat(blockList);
    const numVariables = workspace.getVariablesOfType("Number");
    const stringVariables = workspace.getVariablesOfType("String");
    const boolVariables = workspace.getVariablesOfType("Boolean");
    const colourVariables = workspace.getVariablesOfType("Colour");
    const xmlSerializer = new XMLSerializer();
    const parser = new DOMParser();

    if (numVariables.length > 0) {
      const blockTextSetNum =
        "<xml>" +
        '<block type="variables_set_number" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(numVariables[0])
        ) +
        '<value name="VALUE"> <block type="math_number"> <field name="NUM">10</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockSetNum = parser.parseFromString(
        blockTextSetNum,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockSetNum);

      const blockTextGetNum =
        "<xml>" +
        '<block type="variables_get_number" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(numVariables[0])
        ) +
        "</block>" +
        "</xml>";
      const blockGetNum = parser.parseFromString(
        blockTextGetNum,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetNum);
    }

    if (stringVariables.length > 0) {
      const blockTextSetString =
        "<xml>" +
        '<block type="variables_set_string" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(stringVariables[0])
        ) +
        '<value name="VALUE"> <block type="text"> <field name="TEXT">abc</field> </block> </value>' +
        "</block>" +
        "</xml>";
      const blockSetString = parser.parseFromString(
        blockTextSetString,
        "application/xml"
      ).documentElement.firstChild as Element;

      xmlList.push(blockSetString);

      const blockTextGetString =
        "<xml>" +
        '<block type="variables_get_string" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(stringVariables[0])
        ) +
        "</block>" +
        "</xml>";
      const blockGetString = parser.parseFromString(
        blockTextGetString,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetString);
    }

    if (boolVariables.length > 0) {
      const blockTextSetBool =
        "<xml>" +
        '<block type="variables_set_boolean" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(boolVariables[0])
        ) +
        '<value name="VALUE"> <block type="logic_boolean"> </block> </value>' +
        "</block>" +
        "</xml>";
      const blockSetBool = parser.parseFromString(
        blockTextSetBool,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockSetBool);

      const blockTextGetBool =
        "<xml>" +
        '<block type="variables_get_boolean" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(boolVariables[0])
        ) +
        "</block>" +
        "</xml>";
      const blockGetBool = parser.parseFromString(
        blockTextGetBool,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetBool);
    }

    if (colourVariables.length > 0) {
      const blockTextSetColour =
        "<xml>" +
        '<block type="variables_set_colour" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(colourVariables[0])
        ) +
        '<value name="VALUE"> <block type="color_picker_custom"> </block> </value>' +
        "</block>" +
        "</xml>";
      const blockSetColour = parser.parseFromString(
        blockTextSetColour,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockSetColour);

      const blockTextGetColour =
        "<xml>" +
        '<block type="variables_get_colour" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(colourVariables[0])
        ) +
        "</block>" +
        "</xml>";
      const blockGetColour = parser.parseFromString(
        blockTextGetColour,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetColour);
    }
    return xmlList;
  });
};

const createVariableBtnHanlder = (
  variableBlockType: string,
  valueBlockType: string,
  defaultField?: string,
  defaultValue?: string
) => {
  return (variableName: string) => {
    if (variableName === null || !getVariableByName(variableName)) {
      return;
    }
    const variable = getVariableByName(variableName);
    const variableBlock = createBlock(variableBlockType, 0, 0, true);

    const valueBlock = createBlock(valueBlockType, 0, 0, true);
    valueBlock.setShadow(false);

    if (defaultField && defaultValue) {
      valueBlock.setFieldValue(defaultValue, defaultField);
    }
    variableBlock
      .getInput("VALUE")
      .connection.connect(valueBlock.outputConnection);
    const variableId = variable ? variable.getId() : "";
    variableBlock.setFieldValue(variableId as string, "VAR");

    connectToArduinoBlock(variableBlock);
  };
};
