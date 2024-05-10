import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace } from "blockly";
import _ from "lodash";
import {
  createArduinoAndWorkSpace,
  createListSetupBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import type { Variable } from "../../core/frames/arduino.frame";

describe("list  factories", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it("should be able generate state for list create block", () => {
    const numListBlock = createListSetupBlock(
      workspace,
      "nums",
      VariableTypes.LIST_NUMBER,
      10
    );
    createListSetupBlock(workspace, "texts", VariableTypes.LIST_STRING, 8);
    createListSetupBlock(workspace, "bools", VariableTypes.LIST_BOOLEAN, 6);
    createListSetupBlock(workspace, "colors", VariableTypes.LIST_COLOUR, 4);

    const event = createTestEvent(numListBlock.id);

    const states = eventToFrameFactory(event).frames;
    expect(states.length).toEqual(4);
    const [state1, state2, state3, state4] = states;
    const actualExplanation = states.map((s) => s.explanation).sort();
    const expectedExplanations = [
      'Creating a number list variable named "nums" that stores 10 items.',
      'Creating a text list variable named "texts" that stores 8 items.',
      'Creating a boolean list variable named "bools" that stores 6 items.',
      'Creating a color list variable named "colors" that stores 4 items.',
    ].sort();
    expect(actualExplanation).toEqual(expectedExplanations);
    expect(_.keys(state1.variables).length).toBe(1);
    expect(_.keys(state2.variables).length).toBe(2);
    expect(_.keys(state3.variables).length).toBe(3);
    expect(_.keys(state4.variables).length).toBe(4);

    verifyListSetupVariable(
      "nums",
      VariableTypes.LIST_NUMBER,
      10,
      state4.variables
    );
    verifyListSetupVariable(
      "texts",
      VariableTypes.LIST_STRING,
      8,
      state4.variables
    );
    verifyListSetupVariable(
      "bools",
      VariableTypes.LIST_BOOLEAN,
      6,
      state4.variables
    );
    verifyListSetupVariable(
      "colors",
      VariableTypes.LIST_COLOUR,
      4,
      state4.variables
    );
  });

  const verifyListSetupVariable = (
    name: string,
    type: VariableTypes,
    size: number,
    variables: { [variableName: string]: Variable }
  ) => {
    const variable = variables[name];
    expect(variable.type).toBe(type);
    expect(variable.name).toBe(name);
    expect(variable.id).toBeDefined();
    expect(variable.value).toEqual([..._.range(0, size).map(() => null)]);
  };
});
