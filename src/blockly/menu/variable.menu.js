import Blockly from 'blockly';
import { createBlock, getVariableByName, getBlockByName } from '../helpers/workspace';
Blockly.Variables.flyoutCategory = function (workspace) {
    let xmlList = [];
    const castedWorkspace = workspace;
    const btnNumVariable = document.createElement('button');
    btnNumVariable.setAttribute('text', 'Create Number Variable');
    btnNumVariable.setAttribute('callbackKey', 'CREATE_NUM_VARIABLE');
    castedWorkspace.registerButtonCallback('CREATE_NUM_VARIABLE', function (button) {
        Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), createVariableBtnHanlder('variables_set_number', 'math_number', 'MATH_NUM', '33'), 'Number');
    });
    xmlList.push(btnNumVariable);
    const btnStringVariable = document.createElement('button');
    btnStringVariable.setAttribute('text', 'Create String Variable');
    btnStringVariable.setAttribute('callbackKey', 'CREATE_STRING_VARIABLE');
    castedWorkspace.registerButtonCallback('CREATE_STRING_VARIABLE', function (button) {
        Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), createVariableBtnHanlder('variables_set_string', 'text', 'abc', 'TEXT'), 'String');
    });
    xmlList.push(btnStringVariable);
    const btnBoolVariable = document.createElement('button');
    btnBoolVariable.setAttribute('text', 'Create Boolean Variable');
    btnBoolVariable.setAttribute('callbackKey', 'CREATE_BOOLEAN_VARIABLE');
    // variables_set_colour colour_picker
    // createVariableBtnHanlder
    castedWorkspace.registerButtonCallback('CREATE_BOOLEAN_VARIABLE', function (button) {
        Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), createVariableBtnHanlder('variables_set_boolean', 'logic_boolean'), 'Boolean');
    });
    xmlList.push(btnBoolVariable);
    const btnColourVariable = document.createElement('button');
    btnColourVariable.setAttribute('text', 'Create Color Variable');
    btnColourVariable.setAttribute('callbackKey', 'CREATE_COLOUR_VARIABLE');
    castedWorkspace.registerButtonCallback('CREATE_COLOUR_VARIABLE', function (button) {
        Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), createVariableBtnHanlder('variables_set_colour', 'colour_picker'), 'Colour');
    });
    xmlList.push(btnColourVariable);
    const blockList = Blockly.Variables.flyoutCategoryBlocks(workspace);
    xmlList = xmlList.concat(blockList);
    return xmlList;
};
Blockly.Variables.flyoutCategoryBlocks = function (workspace) {
    const numVariables = workspace.getVariablesOfType('Number');
    const stringVariables = workspace.getVariablesOfType('String');
    const boolVariables = workspace.getVariablesOfType('Boolean');
    const colourVariables = workspace.getVariablesOfType('Colour');
    const xmlSerializer = new XMLSerializer();
    const xmlList = [];
    if (numVariables.length > 0) {
        const blockTextSetNum = '<xml>' +
            '<block type="variables_set_number" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(numVariables[0])) +
            '<value name="VALUE"> <block type="math_number"> <field name="NUM">10</field></block> </value>' +
            '</block>' +
            '</xml>';
        const blockSetNum = Blockly.Xml.textToDom(blockTextSetNum)
            .firstChild;
        xmlList.push(blockSetNum);
        const blockTextGetNum = '<xml>' +
            '<block type="variables_get_number" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(numVariables[0])) +
            '</block>' +
            '</xml>';
        const blockGetNum = Blockly.Xml.textToDom(blockTextGetNum)
            .firstChild;
        xmlList.push(blockGetNum);
    }
    if (stringVariables.length > 0) {
        const blockTextSetString = '<xml>' +
            '<block type="variables_set_string" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(stringVariables[0])) +
            '<value name="VALUE"> <block type="text"> <field name="TEXT">abc</field> </block> </value>' +
            '</block>' +
            '</xml>';
        const blockSetString = Blockly.Xml.textToDom(blockTextSetString)
            .firstChild;
        xmlList.push(blockSetString);
        const blockTextGetString = '<xml>' +
            '<block type="variables_get_string" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(stringVariables[0])) +
            '</block>' +
            '</xml>';
        const blockGetString = Blockly.Xml.textToDom(blockTextGetString)
            .firstChild;
        xmlList.push(blockGetString);
    }
    if (boolVariables.length > 0) {
        const blockTextSetBool = '<xml>' +
            '<block type="variables_set_boolean" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(boolVariables[0])) +
            '<value name="VALUE"> <block type="logic_boolean"> </block> </value>' +
            '</block>' +
            '</xml>';
        const blockSetBool = Blockly.Xml.textToDom(blockTextSetBool)
            .firstChild;
        xmlList.push(blockSetBool);
        const blockTextGetBool = '<xml>' +
            '<block type="variables_get_boolean" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(boolVariables[0])) +
            '</block>' +
            '</xml>';
        const blockGetBool = Blockly.Xml.textToDom(blockTextGetBool)
            .firstChild;
        xmlList.push(blockGetBool);
    }
    if (colourVariables.length > 0) {
        const blockTextSetColour = '<xml>' +
            '<block type="variables_set_colour" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(colourVariables[0])) +
            '<value name="VALUE"> <block type="colour_picker"> </block> </value>' +
            '</block>' +
            '</xml>';
        const blockSetColour = Blockly.Xml.textToDom(blockTextSetColour)
            .firstChild;
        xmlList.push(blockSetColour);
        const blockTextGetColour = '<xml>' +
            '<block type="variables_get_colour" gap="24">' +
            xmlSerializer.serializeToString(Blockly.Variables.generateVariableFieldDom(colourVariables[0])) +
            '</block>' +
            '</xml>';
        const blockGetColour = Blockly.Xml.textToDom(blockTextGetColour)
            .firstChild;
        xmlList.push(blockGetColour);
    }
    return xmlList;
};
const connectToArduinoBlock = function (variableBlock) {
    let arduinoBlock = getBlockByName('arduino_setup') || getBlockByName('arduino_loop'); // See if
    const inputToAttachVariableTo = arduinoBlock.type == 'arduino_setup' ? 'setup' : 'loop';
    const parentConnection = arduinoBlock.getInput(inputToAttachVariableTo)
        .connection;
    parentConnection.connect(variableBlock.previousConnection);
};
const createVariableBtnHanlder = (variableBlockType, valueBlockType, defaultValue, defaultField) => {
    return (variableName) => {
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
            .getInput('VALUE')
            .connection.connect(valueBlock.outputConnection);
        const variableId = variable ? variable.getId() : '';
        variableBlock.setFieldValue(variableId, 'VAR');
        connectToArduinoBlock(variableBlock);
    };
};
