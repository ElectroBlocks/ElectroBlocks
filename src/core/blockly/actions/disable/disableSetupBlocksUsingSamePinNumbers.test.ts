import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../blocks";
import type { Workspace } from "blockly";
import _ from "lodash";
import { ActionType } from "../actions";
import { disableSetupBlocksUsingSamePinNumbers } from "./disableSetupBlocksUsingSamePinNumbers";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";

describe("disableSetupBlocksUsingSamePinNumbers", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should disble blocks with NO_PINS in the pin dropdown", () => {
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup"); // because there are only 6 analog pins the last block should be disabled

    const event = createTestEvent(arduinoBlock.id);
    const actions = disableSetupBlocksUsingSamePinNumbers(event);
    expect(actions.length).toBe(1);
    expect(actions[0].blockId).toBeDefined();
    expect(actions[0].warningText).toBeDefined();
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });
});
