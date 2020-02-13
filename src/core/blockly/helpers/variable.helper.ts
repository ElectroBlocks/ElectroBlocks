import { getWorkspace } from './workspace.helper';

export const deleteVariable = (id: string) => {
  getWorkspace().deleteVariableById(id);
};

export const getAllVariables = () => {
  return getWorkspace().getAllVariables();
};

export const isVariableBeingUsed = (id: string) => {
  return getWorkspace().getVariableUsesById(id).length > 0;
};

export const getVariableByName = (variableName: string) => {
  const variable = getWorkspace()
    .getAllVariables()
    .find((variable) => variable.name === variableName);

  return variable;
};
