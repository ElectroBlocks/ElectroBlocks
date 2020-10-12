import _ from "lodash";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";

export const getVariable: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const variableId = findFieldValue(block, "VAR");
  const variable = variables.find((v) => v.id == variableId);

  return previousState &&
    _.keys(previousState.variables).includes(variable.name)
    ? previousState.variables[variable.name].value
    : undefined;
};
