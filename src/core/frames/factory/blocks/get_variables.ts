import { findFieldValue } from "../../../blockly/helpers/block-data.helper";
import { ValueGenerator } from "../value.factories";

export const getVariable: ValueGenerator = (
    blocks,
    block,
    variables,
    timeline,
    previousState
) => {
    const variableId = findFieldValue(block, 'VAR');
    const variable = variables.find(v => v.id == variableId);
    return variable && previousState.variables[variable.name]
        ? previousState.variables[variable.name].value
        : 1;
};