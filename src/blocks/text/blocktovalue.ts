import _ from "lodash";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type {
  ValueGenerator,
} from "../../core/frames/transformer/block-to-value.factories";
import {
  getInputValue,
} from "../../core/frames/transformer/block-to-value.factories";

export const text: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findFieldValue(block, "TEXT");
};

export const textJoin: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return block.inputBlocks.reduce((prev, next) => {
    if (!next.blockId || !next.name.includes("ADD")) {
      return prev;
    }

    return (
      prev +
      getInputValue(
        blocks,
        block,
        variables,
        timeline,
        next.name,
        "",
        previousState
      )
    );
  }, "");
};

export const textLength: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "VALUE",
    "",
    previousState
  ).length;
};

export const textParse: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const delimiter = findFieldValue(block, "DELIMITER");
  let position = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "POSITION",
    1,
    previousState
  );

  if (position < 0) {
    return "";
  }
  position = position == 0 ? 1 : position;

  const stringToParse = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "VALUE",
    "",
    previousState
  ) as string;

  if (!stringToParse.includes(delimiter)) {
    return "";
  }

  const parts = stringToParse.split(delimiter);

  return parts.length < position ? "" : parts[position - 1];
};

export const textIsEmpty: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const value = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "VALUE",
    "",
    previousState
  );

  return _.isEmpty(value);
};

export const numberToText: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const precision = +findFieldValue(block, "PRECISION");
  const numberAttached = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "NUMBER",
    "",
    previousState
  );
  if (numberAttached === "" || !numberAttached) {
    const number = 0;
    return number.toFixed(precision);
  }

  return numberAttached.toFixed(precision);
};

export const changeCase: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const value = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "TEXT",
    "",
    previousState
  ) as string;

  const type = findFieldValue(block, "CASE");

  switch (type) {
    case "UPPERCASE":
      return value.toUpperCase();
    case "LOWERCASE":
      return value.toLowerCase();
    default:
      return "";
  }

  return _.isEmpty(value);
};
