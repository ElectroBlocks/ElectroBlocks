import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import {
  getInputValue,
  ValueGenerator,
} from "../../core/frames/transformer/block-to-value.factories";

export const logicBoolean: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findFieldValue(block, "BOOL") === "TRUE";
};

export const logicCompare: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const operator = findFieldValue(block, "OP");
  const aValue = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "A",
    undefined,
    previousState
  );
  const bValue = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "B",
    undefined,
    previousState
  );

  if (aValue === undefined || bValue === undefined) {
    return false;
  }

  switch (operator) {
    case "EQ":
      return aValue === bValue;
    case "NEQ":
      return aValue !== bValue;
    case "LT":
      return aValue < bValue;
    case "LTE":
      return aValue <= bValue;
    case "GT":
      return aValue > bValue;
    case "GTE":
      return aValue >= bValue;
    default:
      return false;
  }
};

export const logicOperation: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const operator = findFieldValue(block, "OP");
  const aValue = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "A",
    undefined,
    previousState
  );
  const bValue = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "B",
    undefined,
    previousState
  );

  if (aValue === undefined || bValue === undefined) {
    return false;
  }

  switch (operator) {
    case "AND":
      return aValue && bValue;
    case "OR":
      return aValue || bValue;

    default:
      return false;
  }
};

export const logicNot: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const boolValue = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "BOOL",
    false,
    previousState
  );

  return !boolValue;
};
