import "jest";
import "../../blocks";
import { ActionType, DisableBlock } from "../actions";

import { disableBlocksWithInvalidPinNumbers } from "./disableBlocksWithInvalidPinNumbers";
import type { BlockSvg, Workspace } from "blockly";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";

describe("disable pins where the microcontroller does not have thoses pins", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  let boardSelector: BlockSvg;

  beforeEach(() => {
    [workspace, arduinoBlock, boardSelector] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  test("should disable pin numbers where the don't exists", () => {
    boardSelector.setFieldValue("mega", "boardtype");
    const servoBlock1 = workspace.newBlock("rotate_servo") as BlockSvg;
    servoBlock1.setFieldValue("A15", "PIN");
    boardSelector.setFieldValue("uno", "boardtype");
    const event = createTestEvent(arduinoBlock.id);

    const actions = disableBlocksWithInvalidPinNumbers(event);

    expect(actions.length).toBe(1);
    const [action] = actions;

    expect(action.type).toBe(ActionType.DISABLE_BLOCK);
    expect(action.blockId).toBe(servoBlock1.id);
    expect(action.warningText).toBe(
      "Pin is not avialable for the microcontroller you are using."
    );
  });
});
