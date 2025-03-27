import Blockly, { CodeGenerator } from "blockly";

const setVariableFunction = function (defaultValue) {
  return function (block, generator: CodeGenerator) {
    const variableName = generator.getVariableName(block.getFieldValue("VAR"));
    const variableValue = Blockly["Arduino"].valueToCode(
      block,
      "VALUE",
      Blockly["Arduino"].ORDER_ATOMIC
    );

    return variableName + " = " + (variableValue || defaultValue) + ";\n";
  };
};

const getVariableFunction = function (block, generator: CodeGenerator) {
  const variableName = generator.getVariableName(block.getFieldValue("VAR"));

  return [variableName, Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["variables_set_number"] = setVariableFunction(10);
Blockly["Arduino"]["variables_set_boolean"] = setVariableFunction("true");
Blockly["Arduino"]["variables_set_string"] = setVariableFunction('" "');
Blockly["Arduino"]["variables_set_colour"] =
  setVariableFunction(`{ 22,  0,  22}`);

Blockly["Arduino"]["variables_get_number"] = getVariableFunction;
Blockly["Arduino"]["variables_get_boolean"] = getVariableFunction;
Blockly["Arduino"]["variables_get_string"] = getVariableFunction;
Blockly["Arduino"]["variables_get_colour"] = getVariableFunction;



const setVariableFunctionPy = function (defaultValue) {
  return function (block, generator: CodeGenerator){
    const variableName = generator.getVariableName(block.getFieldValue("VAR"));
    const variableValue = Blockly["Python"].valueToCode(
      block,
      "VALUE",
      Blockly["Python"].ORDER_ATOMIC
    );

    return variableName + " = " + (variableValue || defaultValue) + "\n";
  };
};


const getVariableFunctionPy = function (block, generator: CodeGenerator) {
  const variableName = generator.getVariableName(block.getFieldValue("VAR"));
  
  return [variableName, Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Python"]["variables_set_number"] = setVariableFunctionPy(10);
Blockly["Python"]["variables_set_boolean"] = setVariableFunctionPy("TRUE");
Blockly["Python"]["variables_set_string"] = setVariableFunctionPy("' '");
Blockly["Python"]["variables_set_colour"] =
  setVariableFunctionPy(`{ 22,  0,  22}`);

Blockly["Python"]["variables_get_number"] = getVariableFunctionPy;
Blockly["Python"]["variables_get_boolean"] = getVariableFunctionPy;
Blockly["Python"]["variables_get_string"] = getVariableFunctionPy;
Blockly["Python"]["variables_get_colour"] = getVariableFunctionPy;


