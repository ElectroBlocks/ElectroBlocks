import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import "../../tests/fake-block";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createGetVariable,
  createValueBlock,
  createListSetupBlock,
  createSetListBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import type { Workspace, BlockSvg } from "blockly";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import _ from "lodash";
import type { Color } from "../../core/frames/arduino.frame";

describe("list setup factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should be able to set values in a string list", () => {
    testSetListBlock(
      workspace,
      VariableTypes.LIST_STRING,
      VariableTypes.STRING,
      "",
      "fred",
      "amy",
      "joe"
    );
  });

  it("should be able to set values in a boolean list", () => {
    testSetListBlock(
      workspace,
      VariableTypes.LIST_BOOLEAN,
      VariableTypes.BOOLEAN,
      false,
      true,
      false,
      true
    );
  });

  it("should be able to set values in a color list", () => {
    testSetListBlock(
      workspace,
      VariableTypes.LIST_COLOUR,
      VariableTypes.COLOUR,
      { red: 0, green: 0, blue: 0 },
      { red: 170, green: 0, blue: 170 },
      { red: 0, green: 170, blue: 170 },
      { red: 132, green: 10, blue: 170 }
    );
  });

  it("should be able to set values in a numbers list", () => {
    testSetListBlock(
      workspace,
      VariableTypes.LIST_NUMBER,
      VariableTypes.NUMBER,
      0,
      134,
      23,
      454
    );
  });
});

const testSetListBlock = (
  workspace: Workspace,
  type: VariableTypes,
  valueBlockType: VariableTypes,
  defaultValue: string | number | boolean | Color,
  valueBlock1Value: string | number | boolean | Color,
  valueBlock2Value: string | number | boolean | Color,
  setVariableBlockValue: string | number | boolean | Color
) => {
  const setVariableBlock = createSetVariableBlockWithValue(
    workspace,
    "get_value",
    valueBlockType,
    setVariableBlockValue
  );

  const valueBlock1 = createValueBlock(
    workspace,
    valueBlockType,
    valueBlock1Value
  );
  const valueBlock2 = createValueBlock(
    workspace,
    valueBlockType,
    valueBlock2Value
  );

  const listBlockSetup = createListSetupBlock(workspace, "list", type, 3);

  const numberBlock = workspace.newBlock("math_number") as BlockSvg;
  numberBlock.setFieldValue("1", "NUM");

  const numberBlockStore2 = workspace.newBlock("math_number") as BlockSvg;
  numberBlockStore2.setFieldValue("2", "NUM");

  const numberBlockTooLarge = workspace.newBlock("math_number") as BlockSvg;
  numberBlockTooLarge.setFieldValue("20", "NUM");

  const getVariable1 = createGetVariable(
    setVariableBlock,
    workspace
  ) as BlockSvg;

  const getVariable2 = createGetVariable(
    setVariableBlock,
    workspace
  ) as BlockSvg;

  const setListPosition1 = createSetListBlock(
    workspace,
    listBlockSetup.getFieldValue("VAR"),
    type,
    numberBlock,
    valueBlock1
  );

  const setListPosition2 = createSetListBlock(
    workspace,
    listBlockSetup.getFieldValue("VAR"),
    type,
    numberBlock,
    getVariable1
  );

  const setListPosition3 = workspace.newBlock(
    setListPosition2.type
  ) as BlockSvg;
  setListPosition3.setFieldValue(setListPosition2.getFieldValue("VAR"), "VAR");
  setListPosition2.nextConnection.connect(setListPosition3.previousConnection);

  const setListPosition4 = createSetListBlock(
    workspace,
    setListPosition2.getFieldValue("VAR"),
    type,
    numberBlockTooLarge,
    getVariable2
  );

  const setListPosition5 = createSetListBlock(
    workspace,
    setListPosition2.getFieldValue("VAR"),
    type,
    numberBlockStore2,
    valueBlock2
  );

  connectToArduinoBlock(setListPosition5);
  connectToArduinoBlock(setListPosition4);
  connectToArduinoBlock(setListPosition3);
  connectToArduinoBlock(setListPosition2);
  connectToArduinoBlock(setListPosition1);
  connectToArduinoBlock(setVariableBlock);

  const event = createTestEvent(numberBlock.id);

  const [state1, state2, state3, state4, state5, state6, state7] =
    eventToFrameFactory(event).frames;

  expect(state3.variables["list"].value).toEqual([
    valueBlock1Value,
    null,
    null,
  ]);
  expect(state3.explanation).toBe(
    `List "list" stores ${transformValueToString(
      valueBlock1Value,
      type
    )} at position 1.`
  );

  // Testing that it can over write a variable
  expect(state4.variables["list"].value).toEqual([
    setVariableBlockValue,
    null,
    null,
  ]);
  expect(state4.explanation).toBe(
    `List "list" stores ${transformValueToString(
      setVariableBlockValue,
      type
    )} at position 1.`
  );

  // Testing that a blank block produce an empty string
  expect(state5.explanation).toBe(
    `List "list" stores ${transformValueToString(
      defaultValue,
      type
    )} at position 1.`
  );
  expect(state5.variables["list"].value).toEqual([defaultValue, null, null]);

  // Testing that a position is too large it populates the last one
  expect(state6.explanation).toBe(
    `List "list" stores ${transformValueToString(
      setVariableBlockValue,
      type
    )} at position 3.`
  );
  expect(state6.variables["list"].value).toEqual([
    defaultValue,
    null,
    setVariableBlockValue,
  ]);

  expect(state7.explanation).toBe(
    `List "list" stores ${transformValueToString(
      valueBlock2Value,
      type
    )} at position 2.`
  );
  expect(state7.variables["list"].value).toEqual([
    defaultValue,
    valueBlock2Value,
    setVariableBlockValue,
  ]);
};

const transformValueToString = (value: any, listType: VariableTypes) => {
  if (listType === VariableTypes.LIST_COLOUR) {
    return `(red=${value.red},green=${value.green},blue=${value.blue})`;
  }

  if (listType === VariableTypes.LIST_STRING) {
    return `"${value}"`;
  }

  return value;
};
