import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../blocks";
import type { Workspace } from "blockly";
import _ from "lodash";
import { ActionType } from "../actions";
import { disableDuplicateSetupBlocks } from "./disableDuplicateSetupBlock";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";

describe("disableDuplicatePinBlocks", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("if there are more than one setup blocks it should disable both unless multiple are allowed like the button or analog read setup blocks.", () => {
    const setupBlock = workspace.newBlock("rfid_setup");
    const setupBlock1 = workspace.newBlock("rfid_setup");
    workspace.newBlock("button_setup");
    workspace.newBlock("button_setup");

    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    const event = createTestEvent(arduinoBlock.id);
    const actions = disableDuplicateSetupBlocks(event);

    expect(actions.length).toBe(2);
    expect(actions.map((a) => a.blockId).sort()).toEqual(
      [setupBlock1.id, setupBlock.id].sort()
    );
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
    expect(actions[0].warningText).toBe(
      "Duplicate setup blocks, please remove one"
    );
  });

  it("should not disable setup block where there is only one setup block", () => {
    const setupBlock = workspace.newBlock("rfid_setup");

    const event = createTestEvent(setupBlock.id);
    const actions = disableDuplicateSetupBlocks(event);
    expect(actions).toEqual([]);
  });
});
