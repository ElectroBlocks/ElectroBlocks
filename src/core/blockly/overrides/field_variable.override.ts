import Blockly from "blockly";

Blockly.FieldVariable.prototype.initModel = function () {
  if (this.variable) {
    return; // Initialization already happened.
  }
  this.workspace_ = this.sourceBlock_.workspace;
  const variables = Blockly.getMainWorkspace().getVariablesOfType(
    this.defaultType
  );
  let variableId = null;

  // This create new variable make it so that it creates a new variable
  if (variables.length > 0 && this.createNewVariable !== true) {
    variableId = variables[variables.length - 1].getId();
  }

  const variable = Blockly.Variables.getOrCreateVariablePackage(
    this.workspace_,
    variableId,
    this.defaultVariableName,
    this.defaultType
  );

  // Don't fire a change event for this setValue.  It would have null as the
  // old value, which is not valid.
  Blockly.Events.disable();
  try {
    this.setValue(variable.getId());
  } catch (e) {
    console.log(e, "error for");
  } finally {
    Blockly.Events.enable();
  }
};

Blockly.FieldVariable.dropdownCreate = function () {
  if (!this.getVariable()) {
    console.log(this.getSourceBlock(), "failed variable");
    return;
  }
  const name = this.getText();
  let workspace = null;
  if (this.getSourceBlock()) {
    workspace = this.getSourceBlock().workspace;
  }

  let variableModelList = [];
  if (workspace && (this as any).showOnlyVariableAssigned === false) {
    const variableTypes = workspace.getVariableTypes().filter((x) => x !== "");
    // Get a copy of the list, so that adding rename and new variable options
    // doesn't modify the workspace's list.
    for (let i = 0; i < variableTypes.length; i++) {
      const variableType = variableTypes[i];
      const variables = workspace.getVariablesOfType(variableType);
      variableModelList = variableModelList.concat(variables);
    }
    variableModelList.sort(Blockly.VariableModel.compareByName);
  }

  if (workspace && (this as any).showOnlyVariableAssigned !== false) {
    variableModelList.push(this.getVariable());
  }

  const options = [];
  for (let i = 0; i < variableModelList.length; i++) {
    // Set the UUID as the internal representation of the variable.
    options[i] = [variableModelList[i].name, variableModelList[i].getId()];
  }
  options.push([Blockly.Msg["RENAME_VARIABLE"], Blockly.RENAME_VARIABLE_ID]);
  if (Blockly.Msg["DELETE_VARIABLE"]) {
    options.push([
      Blockly.Msg["DELETE_VARIABLE"].replace("%1", name),
      Blockly.DELETE_VARIABLE_ID,
    ]);
  }

  return options;
};

Blockly.FieldVariable.fromJson = function (options) {
  const varname = Blockly.utils.parsing.replaceMessageReferences(
    options["variable"]
  );
  const variableTypes = options["variableTypes"];
  const defaultType = options["defaultType"];
  const showOnlyVariableAssigned = options["showOnlyVariableAssigned"] || false;
  const createNewVariable = options["createNewVariable"] || false;
  const fieldVariable = new Blockly.FieldVariable(
    varname,
    null,
    variableTypes,
    defaultType
  );

  (fieldVariable as any).showOnlyVariableAssigned = showOnlyVariableAssigned;
  (fieldVariable as any).createNewVariable = createNewVariable;

  return fieldVariable;
};
