import type { WorkspaceSvg } from "blockly";
import Blockly from "blockly";
import { getVariableByName } from "../../core/blockly/helpers/variable.helper";
import { createBlock } from "../../core/blockly/helpers/block.helper";
/**
 * Crappy code to register the button listeners for blockly
 */

export const registerListMenu = (workspace: WorkspaceSvg) => {
  var parser = new DOMParser();

  workspace.registerToolboxCategoryCallback("LIST", () => {
    const xmlList: Element[] = [];
    const btnCreateNumberList = document.createElement("button");
    btnCreateNumberList.setAttribute("text", "Create a list of number");
    btnCreateNumberList.setAttribute("callbackKey", "CREATE_NUMBER_LIST");
    const xmlSerializer = new XMLSerializer();
    workspace.registerButtonCallback("CREATE_NUMBER_LIST", () => {
      Blockly.Variables.createVariableButtonHandler(
        workspace,
        createListButtonHandler("create_list_number_block"),
        "List Number"
      );
    });

    xmlList.push(btnCreateNumberList);

    const btnCreateStringList = document.createElement("button");
    btnCreateStringList.setAttribute("text", "Create a list of string");
    btnCreateStringList.setAttribute("callbackKey", "CREATE_STRING_LIST");

    workspace.registerButtonCallback("CREATE_STRING_LIST", () => {
      Blockly.Variables.createVariableButtonHandler(
        workspace,
        createListButtonHandler("create_list_string_block"),
        "List String"
      );
    });
    xmlList.push(btnCreateStringList);

    const btnCreateBooleanList = document.createElement("button");
    btnCreateBooleanList.setAttribute("text", "Create a list of boolean");
    btnCreateBooleanList.setAttribute("callbackKey", "CREATE_BOOLEAN_LIST");
    workspace.registerButtonCallback("CREATE_BOOLEAN_LIST", () => {
      Blockly.Variables.createVariableButtonHandler(
        workspace,
        createListButtonHandler("create_list_boolean_block"),
        "List Boolean"
      );
    });
    xmlList.push(btnCreateBooleanList);

    const btnCreateColorList = document.createElement("button");
    btnCreateColorList.setAttribute("text", "Create a list of colors");
    btnCreateColorList.setAttribute("callbackKey", "CREATE_COLOUR_LIST");
    workspace.registerButtonCallback("CREATE_COLOUR_LIST", () => {
      Blockly.Variables.createVariableButtonHandler(
        workspace,
        createListButtonHandler("create_list_colour_block"),
        "List Colour"
      );
    });
    xmlList.push(btnCreateColorList);

    const numberListVariables = workspace.getVariablesOfType("List Number");

    if (numberListVariables.length > 0) {
      const blockNumberListSetText =
        "<xml>" +
        '<block type="set_number_list_block" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(numberListVariables[0])
        ) +
        '<value name="VALUE"> <block type="math_number"> <field name="NUM">10</field></block> </value>' +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockSetNumberList = parser.parseFromString(
        blockNumberListSetText,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockSetNumberList);

      const blockTextGetListNum =
        "<xml>" +
        '<block type="get_number_from_list" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(numberListVariables[0])
        ) +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockGetListNum = parser.parseFromString(
        blockTextGetListNum,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetListNum);
    }

    const stringListVariables = workspace.getVariablesOfType("List String");

    if (stringListVariables.length > 0) {
      const blockStringListSetText =
        "<xml>" +
        '<block type="set_string_list_block" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(stringListVariables[0])
        ) +
        '<value name="VALUE"> <block type="text"> <field name="TEXT">abc</field></block> </value>' +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockSetStringList = parser.parseFromString(
        blockStringListSetText,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockSetStringList);

      const blockTextGetListText =
        "<xml>" +
        '<block type="get_string_from_list" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(stringListVariables[0])
        ) +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockGetListText = parser.parseFromString(
        blockTextGetListText,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetListText);
    }

    const booleanListVariables = workspace.getVariablesOfType("List Boolean");

    if (booleanListVariables.length > 0) {
      const blockBooleanListSetText =
        "<xml>" +
        '<block type="set_boolean_list_block" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(booleanListVariables[0])
        ) +
        '<value name="VALUE"><block type="logic_boolean"></block></value>' +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockSetBooleanList = parser.parseFromString(
        blockBooleanListSetText,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockSetBooleanList);

      const blockTextGetListBoolean =
        "<xml>" +
        '<block type="get_boolean_from_list" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(booleanListVariables[0])
        ) +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockGetListBoolean = parser.parseFromString(
        blockTextGetListBoolean,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetListBoolean);
    }

    const colourListVariables = workspace.getVariablesOfType("List Colour");

    if (colourListVariables.length > 0) {
      const blockColourListSetText =
        "<xml>" +
        '<block type="set_colour_list_block" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(colourListVariables[0])
        ) +
        '<value name="VALUE"><block type="color_picker_custom"></block></value>' +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockColourListSet = parser.parseFromString(
        blockColourListSetText,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockColourListSet);

      const blockTextGetListColor =
        "<xml>" +
        '<block type="get_colour_from_list" gap="24">' +
        xmlSerializer.serializeToString(
          Blockly.Variables.generateVariableFieldDom(colourListVariables[0])
        ) +
        '<value name="POSITION"> <block type="math_number"> <field name="NUM">1</field></block> </value>' +
        "</block>" +
        "</xml>";
      const blockGetListColor = parser.parseFromString(
        blockTextGetListColor,
        "application/xml"
      ).documentElement.firstChild as Element;
      xmlList.push(blockGetListColor);
    }

    return xmlList;
  });
};

const createListButtonHandler = (blockType: string) => {
  return (variableName?: string) => {
    if (variableName === undefined || !getVariableByName(variableName)) {
      return;
    }
    const variable = getVariableByName(variableName);
    const variableId = variable ? variable.getId() : "";

    const listBlock = createBlock(blockType, 20, 20, false);
    listBlock.setFieldValue(variableId, "VAR");
  };
};

export default registerListMenu;
