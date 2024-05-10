import { vi, expect } from "vitest";
import { Workspace, BlockSvg, WorkspaceSvg } from "blockly";
import * as helpers from "../core/blockly/helpers/workspace.helper";
import { VariableTypes } from "../core/blockly/dto/variable.type";
import type { Variable, Color } from "../core/frames/arduino.frame";
import { rgbToHex } from "../core/blockly/helpers/color.helper";
import type { BlockEvent } from "../core/blockly/dto/event.type";
import { MicroControllerType } from "../core/microcontroller/microcontroller";
import { getAllBlocks } from "../core/blockly/helpers/block.helper";
import { transformBlock } from "../core/blockly/transformers/block.transformer";
import { getAllVariables } from "../core/blockly/helpers/variable.helper";
import { transformVariable } from "../core/blockly/transformers/variables.transformer";
import Blockly from "blockly";

export const createArduinoAndWorkSpace = (): [WorkspaceSvg, BlockSvg] => {
  const workspace = new Workspace() as WorkspaceSvg;

  vi.spyOn(helpers, "getWorkspace").mockReturnValue(workspace as WorkspaceSvg);
  const arduinoBlock = workspace.newBlock("arduino_loop") as BlockSvg;

  return [workspace, arduinoBlock];
};

export const verifyVariable = (
  variableName: string,
  type: VariableTypes,
  value: any,
  variables: { [key: string]: Variable }
) => {
  const variable = variables[variableName];
  expect(variable).toBeDefined();
  expect(variable.id).toBeDefined();
  expect(variable.value).toEqual(value);
  expect(variable.type).toBe(type);
};

export const createSetVariableBlockWithValue = (
  workspace: Workspace,
  name: string,
  type: VariableTypes,
  value: string | number | boolean | Color
) => {
  const variableModel = workspace.createVariable(name, type);
  if (type === VariableTypes.NUMBER) {
    const block = workspace.newBlock("variables_set_number");
    const valueBlock = workspace.newBlock("math_number");
    valueBlock.setFieldValue(value.toString(), "NUM");
    block.getInput("VALUE").connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), "VAR");
    return block as BlockSvg;
  }
  if (type === VariableTypes.BOOLEAN) {
    const block = workspace.newBlock("variables_set_boolean");
    const valueBlock = workspace.newBlock("logic_boolean");
    valueBlock.setFieldValue(value ? "TRUE" : "FALSE", "BOOL");
    block.getInput("VALUE").connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), "VAR");
    return block as BlockSvg;
  }

  if (type === VariableTypes.STRING) {
    const block = workspace.newBlock("variables_set_string");
    const valueBlock = workspace.newBlock("text");
    valueBlock.setFieldValue(value.toString(), "TEXT");
    block.getInput("VALUE").connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), "VAR");
    return block as BlockSvg;
  }

  if (type === VariableTypes.COLOUR) {
    const block = workspace.newBlock("variables_set_colour");
    const valueBlock = workspace.newBlock("color_picker_custom");
    valueBlock.setFieldValue(rgbToHex(value as Color), "COLOR");
    block.getInput("VALUE").connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), "VAR");
    return block as BlockSvg;
  }

  throw new Error("Unsupported Variable Type: " + type);
};

export const createListSetupBlock = (
  workspace: Workspace,
  name: string,
  type: VariableTypes,
  size: number
) => {
  const variableModel = workspace.createVariable(name, type);
  const block = createListBlockByType(type, workspace);
  block.setFieldValue(variableModel.getId(), "VAR");
  block.setFieldValue(size.toString(), "SIZE");

  return block;
};

const createListBlockByType = (type: VariableTypes, workspace: Workspace) => {
  switch (type) {
    case VariableTypes.LIST_NUMBER:
      return workspace.newBlock("create_list_number_block");
    case VariableTypes.LIST_BOOLEAN:
      return workspace.newBlock("create_list_boolean_block");
    case VariableTypes.LIST_STRING:
      return workspace.newBlock("create_list_string_block");
    case VariableTypes.LIST_COLOUR:
      return workspace.newBlock("create_list_colour_block");
    default:
      throw new Error("un supported list");
  }
};

export const createSetListBlock = (
  workspace: Workspace,
  variableId: string,
  type: VariableTypes,
  positionBlock: BlockSvg,
  valueBlock: BlockSvg
) => {
  const block = workspace.newBlock(getSetVariableBlock(type));
  block.getInput("VALUE").connection.connect(valueBlock.outputConnection);
  block.setFieldValue(variableId, "VAR");
  block.getInput("POSITION").connection.connect(positionBlock.outputConnection);

  return block as BlockSvg;
};

const getSetVariableBlock = (type: VariableTypes) => {
  switch (type) {
    case VariableTypes.LIST_NUMBER:
      return "set_number_list_block";
    case VariableTypes.LIST_COLOUR:
      return "set_colour_list_block";
    case VariableTypes.LIST_BOOLEAN:
      return "set_boolean_list_block";
    case VariableTypes.LIST_STRING:
      return "set_string_list_block";

    default:
      return "set_number_list_block";
  }
};

export const createValueBlock = (
  workspace: Workspace,
  type: VariableTypes,
  value: string | number | boolean | Color
): BlockSvg => {
  if (type === VariableTypes.STRING) {
    const block = workspace.newBlock("text");
    block.setFieldValue(value.toString(), "TEXT");

    return block as BlockSvg;
  }

  if (type === VariableTypes.BOOLEAN) {
    const block = workspace.newBlock("logic_boolean");
    block.setFieldValue(value ? "TRUE" : "FALSE", "BOOL");

    return block as BlockSvg;
  }

  if (type === VariableTypes.NUMBER) {
    const block = workspace.newBlock("math_number");
    block.setFieldValue(value.toString(), "NUM");

    return block as BlockSvg;
  }

  if (type === VariableTypes.COLOUR) {
    const block = workspace.newBlock("color_picker_custom");
    block.setFieldValue(rgbToHex(value as Color), "COLOR");

    return block as BlockSvg;
  }

  throw new Error("unsupported type");
};

export const createGetVariable = (setBlock: BlockSvg, workspace: Workspace) => {
  const getVariableType = setBlock.type.replace("set", "get");
  const block = workspace.newBlock(getVariableType);
  block.setFieldValue(setBlock.getFieldValue("VAR"), "VAR");

  return block;
};

export const createTestEvent = (
  blockId: string,
  type = Blockly.Events.BLOCK_MOVE
): BlockEvent => {
  return {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type,
    blockId,
    microController: MicroControllerType.ARDUINO_UNO,
  };
};
