import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { Variable } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByVariable,
  getDefaultValue,
  valueToString,
} from "../../core/frames/transformer/frame-transformer.helpers";

export const setVariable: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const variableId = findFieldValue(block, "VAR");
  const variable = variables.find((v) => v.id === variableId);
  const defaultValue = getDefaultValue(variable.type);

  const value = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "VALUE",
    defaultValue,
    previousState
  );
  const newVariable: Variable = {
    type: variable.type,
    value,
    name: variable.name,
    id: variableId,
  };

  const explanation = `Variable "${variable.name}" stores ${valueToString(
    value,
    variable.type
  )}.`;

  return [
    arduinoFrameByVariable(
      block.id,
      block.blockName,
      timeline,
      newVariable,
      explanation,
      previousState
    ),
  ];
};
