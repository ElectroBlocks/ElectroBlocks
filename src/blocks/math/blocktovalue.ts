import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";

export const mathNumber: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return +findFieldValue(block, "NUM");
};

export const mathArithmetic: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const aValue = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "A",
    1,
    previousState
  );
  const bValue = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "B",
    1,
    previousState
  );

  const operator = findFieldValue(block, "OP");

  switch (operator) {
    case "ADD":
      return aValue + bValue;
    case "MINUS":
      return aValue - bValue;
    case "MULTIPLY":
      return aValue * bValue;
    case "DIVIDE":
      return aValue / bValue;
    case "POWER":
      return Math.pow(aValue, bValue);
    default:
      return 1;
  }
};

export const mathRound: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const roundNumber = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "NUM",
    1,
    previousState
  );
  const operator = findFieldValue(block, "OP");

  switch (operator) {
    case "ROUND":
      return Math.round(roundNumber);
    case "ROUNDUP":
      return Math.ceil(roundNumber);
    case "ROUNDDOWN":
      return Math.floor(roundNumber);
    default:
      return 1;
  }
};

export const mathModulus: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const dividend = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "DIVIDEND",
    1,
    previousState
  );
  const divisor = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "DIVISOR",
    1,
    previousState
  );

  return dividend % divisor;
};

export const mathRandom: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const from = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "FROM",
    1,
    previousState
  );
  const to = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "TO",
    1,
    previousState
  );

  return mathRandomInt(from, to);
};

export const numberToString: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "VALUE",
    1,
    previousState
  );
};

export const mathNumberProperty: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const number = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "NUMBER_TO_CHECK",
    1,
    previousState
  );

  const checkBy = findFieldValue(block, "PROPERTY");

  if (checkBy === "EVEN") {
    return number % 2 === 0;
  }

  if (checkBy === "ODD") {
    return number % 2 === 1;
  }

  if (checkBy === "POSITIVE") {
    return number > 0;
  }

  if (checkBy === "NEGATIVE") {
    return number < 0;
  }

  if (checkBy === "DIVISIBLE_BY") {
    const divisor = +getInputValue(
      blocks,
      block,
      variables,
      timeline,
      "DIVISOR",
      1,
      previousState
    );

    return number % divisor === 0;
  }

  throw new Error(`No checkby found for this check: ${checkBy}.`);
};

function mathRandomInt(a: number, b: number) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    let c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}
