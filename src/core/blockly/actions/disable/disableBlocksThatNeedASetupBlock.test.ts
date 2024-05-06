import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";

import { disableBlocksThatNeedASetupBlock } from "./disableBlocksThatNeedASetupBlock";
import { ActionType } from "../actions";

describe("disableBlocksThatNeedASetupBlock", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("disable blocks require a setup block", () => {
    workspace.newBlock("arduino_send_message");
    workspace.newBlock("message_setup");
    workspace.newBlock("button_setup");
    workspace.newBlock("button_setup");
    workspace.newBlock("is_button_pressed");
    workspace.newBlock("is_button_pressed");
    workspace.newBlock("is_button_pressed");
    const bluetoothBlockId = workspace.newBlock("bluetooth_send_message").id;
    const lcdScreenClearBlockId = workspace.newBlock("lcd_screen_clear").id;
    const idsThatShouldBeDisabled = [bluetoothBlockId, lcdScreenClearBlockId];
    const event = createTestEvent(arduinoBlock.id);

    const disableActions = disableBlocksThatNeedASetupBlock(event);

    expect(idsThatShouldBeDisabled).toEqual(
      disableActions.map((a) => a.blockId)
    );
    expect(disableActions[0].type).toBe(ActionType.DISABLE_BLOCK);
    disableActions.forEach((a) => {
      expect(a.warningText).toContain("This block requires a ");
      expect(a.warningText).not.toContain("undefined");
    });
  });

  it("if setup block is disabled then it should disable blocks that require it", () => {
    const setupBlock = workspace.newBlock("message_setup");
    setupBlock.setEnabled(false);
    workspace.newBlock("arduino_send_message");

    const event = createTestEvent(arduinoBlock.id);
    const disableActions = disableBlocksThatNeedASetupBlock(event);

    expect(disableActions.length).toBe(1);
  });
});
