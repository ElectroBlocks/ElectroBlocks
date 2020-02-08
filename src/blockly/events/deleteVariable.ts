import {
  getAllVariables,
  isVariableBeingUsed,
  deleteVariable
} from '../helpers/variable.helper';

// Loops through all the variables and
// makes sure that they are being used in a block
const deleteVariables = () => {
  const variables = getAllVariables();

  variables
    .filter((variable) => !isVariableBeingUsed(variable.getId()))
    .forEach((variable) => {
      deleteVariable(variable.getId());
    });
};

export default deleteVariables;
