import _ from "lodash";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { hexToRgb } from "../../core/blockly/helpers/color.helper";
import {
  getInputValue,
  ValueGenerator,
} from "../../core/frames/transformer/block-to-value.factories";

export const colorPicker: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const color = findFieldValue(block, "COLOR");

  return hexToRgb(color);
};

export const randomColor: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return {
    red: _.random(1, 256),
    green: _.random(1, 256),
    blue: _.random(1, 256),
  };
};

export const rgbColor: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const red = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "RED",
    0,
    previousState
  );
  const green = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "GREEN",
    0,
    previousState
  );
  const blue = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "BLUE",
    0,
    previousState
  );

  return {
    red,
    green,
    blue,
  };
};
