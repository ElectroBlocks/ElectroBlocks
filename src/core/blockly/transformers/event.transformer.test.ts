import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import type { Workspace } from "blockly";
import Blockly from "blockly";
import { transformBlock } from "./block.transformer";
import { transformEvent } from "./event.transformer";
import { getAllBlocks } from "../helpers/block.helper";
import _ from "lodash";
import { getAllVariables } from "../helpers/variable.helper";
import { VariableTypes } from "../dto/variable.type";
import { createArduinoAndWorkSpace } from "../../../tests/tests.helper";
import { MicroControllerType } from "../../microcontroller/microcontroller";

describe("event transformer", () => {
  let workspace: Workspace;

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should transform a change event", () => {
    const changeEvent = transformEvent(
      getAllBlocks(),
      [],
      {
        type: Blockly.Events.CHANGE,
        blockId: "blockId",
        element: "dropdown",
        name: "loop",
        newValue: "3",
        oldValue: "2",
      },
      MicroControllerType.ARDUINO_UNO
    );

    expect(changeEvent.blocks).toEqual(getAllBlocks().map(transformBlock));
    expect(changeEvent.type).toEqual(Blockly.Events.CHANGE);
    expect(changeEvent.blockId).toEqual("blockId");
    expect(changeEvent.fieldName).toEqual("loop");
    expect(changeEvent.fieldType).toBe("dropdown");
    expect(changeEvent.newValue).toEqual("3");
    expect(changeEvent.oldValue).toEqual("2");
  });

  it("it should have a list of variables", () => {
    workspace.createVariable("b", "Boolean");
    workspace.createVariable("c", "String");
    workspace.newBlock("variables_set_number");
    const deleteEvent = transformEvent(
      getAllBlocks(),
      getAllVariables(),
      {
        type: Blockly.Events.DELETE,
        blockId: "blockId",
      },
      MicroControllerType.ARDUINO_UNO
    );

    expect(deleteEvent.variables.length).toBe(3);
    const bVariable = deleteEvent.variables.find((v) => v.name === "b");
    expect(bVariable.isBeingUsed).toBeFalsy();
    expect(bVariable.type).toBe(VariableTypes.BOOLEAN);
    const cVariable = deleteEvent.variables.find((v) => v.name === "c");
    expect(cVariable.isBeingUsed).toBeFalsy();
    expect(cVariable.type).toBe(VariableTypes.STRING);
    const variable = deleteEvent.variables.find(
      (v) => v.name !== "c" && v.name !== "b"
    );
    expect(variable.isBeingUsed).toBeTruthy();
  });

  it("should transform a delete event", () => {
    const deleteEvent = transformEvent(
      getAllBlocks(),
      [],
      {
        type: Blockly.Events.DELETE,
        blockId: "blockId",
      },
      MicroControllerType.ARDUINO_UNO
    );

    expect(deleteEvent.blocks).toEqual(getAllBlocks().map(transformBlock));
    expect(deleteEvent.type).toEqual(Blockly.Events.DELETE);
    expect(deleteEvent.blockId).toEqual("blockId");
    expect(deleteEvent.oldValue).toBeUndefined();
  });
});
