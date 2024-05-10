import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import "../../tests/fake-block";

import {
  createValueBlock,
  createSetVariableBlockWithValue,
  createListSetupBlock,
  createSetListBlock,
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import type { Color } from "../../core/frames/arduino.frame";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import _ from "lodash";

describe("list get items value factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  it("should be able to get items in a number list", () => {
    testGetItemsInList(
      workspace,
      VariableTypes.LIST_NUMBER,
      VariableTypes.NUMBER,
      0,
      33,
      44
    );
  });

  it("should be able to get items in a string list", () => {
    testGetItemsInList(
      workspace,
      VariableTypes.LIST_STRING,
      VariableTypes.STRING,
      "",
      "tim",
      "amy"
    );
  });

  it("should be able to get items in a booleans list", () => {
    testGetItemsInList(
      workspace,
      VariableTypes.LIST_BOOLEAN,
      VariableTypes.BOOLEAN,
      false,
      true,
      false
    );
  });

  it("should be able to get items in a colours list", () => {
    testGetItemsInList(
      workspace,
      VariableTypes.LIST_COLOUR,
      VariableTypes.COLOUR,
      { red: 0, green: 0, blue: 0 },
      { red: 120, green: 0, blue: 120 },
      { red: 100, green: 200, blue: 0 }
    );
  });
});

const testGetItemsInList = (
  workspace: Workspace,
  type: VariableTypes,
  valueBlockType: VariableTypes,
  defaultValue: string | number | boolean | Color,
  valueBlock1Value: string | number | boolean | Color,
  valueBlock3Value: string | number | boolean | Color
) => {
  const listBlockSetup = createListSetupBlock(workspace, "list", type, 3);
  const listVariableId = listBlockSetup.getFieldValue("VAR");
  const valueBlock1 = createValueBlock(
    workspace,
    valueBlockType,
    valueBlock1Value
  );
  const valueBlock2 = createValueBlock(
    workspace,
    valueBlockType,
    valueBlock3Value
  );

  const numberBlock1 = workspace.newBlock("math_number") as BlockSvg;
  numberBlock1.setFieldValue("1", "NUM");

  const numberBlock3 = workspace.newBlock("math_number") as BlockSvg;
  numberBlock3.setFieldValue("3", "NUM");

  const listSetPosition1 = createSetListBlock(
    workspace,
    listBlockSetup.getFieldValue("VAR"),
    type,
    numberBlock1,
    valueBlock1
  );

  const listSetPosition2 = createSetListBlock(
    workspace,
    listBlockSetup.getFieldValue("VAR"),
    type,
    numberBlock3,
    valueBlock2
  );

  const setListItemVariable = createSetVariableBlockWithListItemAttached(
    workspace,
    valueBlockType,
    listVariableId,
    -1,
    defaultValue
  );

  const setListItemVariable1 = createSetVariableBlockWithListItemAttached(
    workspace,
    valueBlockType,
    listVariableId,
    0,
    defaultValue
  );

  const setListItemVariable2 = createSetVariableBlockWithListItemAttached(
    workspace,
    valueBlockType,
    listVariableId,
    1,
    defaultValue
  );

  const setListItemVariable3 = createSetVariableBlockWithListItemAttached(
    workspace,
    valueBlockType,
    listVariableId,
    2,
    defaultValue
  );

  const setListItemVariable4 = createSetVariableBlockWithListItemAttached(
    workspace,
    valueBlockType,
    listVariableId,
    3,
    defaultValue
  );

  const setListItemVariable20 = createSetVariableBlockWithListItemAttached(
    workspace,
    valueBlockType,
    listVariableId,
    20,
    defaultValue
  );

  connectToArduinoBlock(listSetPosition1);
  listSetPosition1.nextConnection.connect(listSetPosition2.previousConnection);
  listSetPosition2.nextConnection.connect(
    setListItemVariable.previousConnection
  );
  setListItemVariable.nextConnection.connect(
    setListItemVariable1.previousConnection
  );
  setListItemVariable1.nextConnection.connect(
    setListItemVariable2.previousConnection
  );
  setListItemVariable2.nextConnection.connect(
    setListItemVariable3.previousConnection
  );
  setListItemVariable3.nextConnection.connect(
    setListItemVariable4.previousConnection
  );
  setListItemVariable4.nextConnection.connect(
    setListItemVariable20.previousConnection
  );

  const event = createTestEvent(setListItemVariable4.id);

  const [
    state1,
    state2,
    state3,
    state4,
    state5,
    state6,
    state7,
    state8,
    state9,
    state10,
  ] = eventToFrameFactory(event).frames;

  // Testing variables are not being creating
  expect(_.keys(state1.variables).length).toBe(1);
  expect(_.keys(state2.variables).length).toBe(1);

  // Testing that a negative blocks sets
  expect(state4.variables["var1_-1"].value).toEqual(valueBlock1Value);
  expect(_.keys(state4.variables).length).toBe(2);

  // testing that 0 returns first element
  expect(state5.variables["var1_0"].value).toEqual(valueBlock1Value);
  expect(_.keys(state5.variables).length).toBe(3);

  // testing 1 returns the first element
  expect(state6.variables["var1_1"].value).toEqual(valueBlock1Value);
  expect(_.keys(state6.variables).length).toBe(4);

  // testing 2 returns the second element
  expect(state7.variables["var1_2"].value).toBeNull();
  expect(_.keys(state7.variables).length).toBe(5);

  // Testing if no element is the stop that it will return null
  expect(state8.variables["var1_3"].value).toEqual(valueBlock3Value);
  expect(_.keys(state8.variables).length).toBe(6);

  // Testing if the number is out of range will use the last element which is not set so it should be null
  expect(state9.variables["var1_20"].value).toEqual(valueBlock3Value);
  expect(_.keys(state9.variables).length).toBe(7);
};

const createSetVariableBlockWithListItemAttached = (
  workspace: Workspace,
  type: VariableTypes,
  listVariableId: string,
  position: number,
  defaultValue: any
) => {
  const variableBlock = createSetVariableBlockWithValue(
    workspace,
    "var1_" + position,
    type,
    defaultValue
  );

  const getItemInListBlock = createGetListItemBlock(
    workspace,
    type,
    listVariableId,
    position
  );

  variableBlock.getInput("VALUE").connection.targetBlock().dispose(true);

  variableBlock
    .getInput("VALUE")
    .connection.connect(getItemInListBlock.outputConnection);

  return variableBlock;
};

const createGetListItemBlock = (
  workspace: Workspace,
  type: VariableTypes,
  listVariableId: string,
  position: number
) => {
  const block = workspace.newBlock(toArrayBlockType(type));
  block.setFieldValue(listVariableId, "VAR");
  const positionBlock = createValueBlock(
    workspace,
    VariableTypes.NUMBER,
    position
  );
  block.getInput("POSITION").connection.connect(positionBlock.outputConnection);

  return block;
};

const toArrayBlockType = (type: VariableTypes) => {
  switch (type) {
    case VariableTypes.COLOUR:
      return "get_colour_from_list";
    case VariableTypes.BOOLEAN:
      return "get_boolean_from_list";
    case VariableTypes.NUMBER:
      return "get_number_from_list";
    case VariableTypes.STRING:
      return "get_string_from_list";
  }
};
