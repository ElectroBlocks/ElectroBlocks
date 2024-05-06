import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import Blockly, { Workspace } from "blockly";
import _ from "lodash";
import { deleteUnusedVariables } from "./deleteUnusedVariables";
import { getAllVariables } from "../helpers/variable.helper";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";

describe("deleteUnusedVariables", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should create delete variable actions for unused variables", () => {
    const b = workspace.createVariable("var_b", "Number");
    const c = workspace.createVariable("var_c", "String");
    workspace.newBlock("variables_set_number");
    expect(getAllVariables().length).toBe(3);
    const event = createTestEvent(arduinoBlock.id, Blockly.Events.BLOCK_DELETE);

    const actions = deleteUnusedVariables(event);
    expect(actions.length).toBe(2);
    const bAction = actions.find((d) => d.variableId == b.getId());
    expect(bAction).toBeDefined();
    expect(bAction.actionType).toBe("delete");

    const cAction = actions.find((d) => d.variableId == c.getId());
    expect(cAction).toBeDefined();
    expect(cAction.actionType).toBe("delete");
  });
});
