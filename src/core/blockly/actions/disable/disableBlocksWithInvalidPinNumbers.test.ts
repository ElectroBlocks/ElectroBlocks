import { describe, it, beforeEach, afterEach, expect } from "vitest";
import "../../blocks";
import { ActionType } from "../actions";

import { disableBlocksWithInvalidPinNumbers } from "./disableBlocksWithInvalidPinNumbers";
import type { BlockSvg, Workspace } from "blockly";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";
import settingsStore from "../../../../stores/settings.store";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

describe("disable pins where the microcontroller does not have thoses pins", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should disable pin numbers where the don't exists", () => {
    settingsStore.update((settings) => {
      return { ...settings, boardType: MicroControllerType.ARDUINO_MEGA };
    });
    const servoBlock1 = workspace.newBlock("rotate_servo") as BlockSvg;
    servoBlock1.setFieldValue("A15", "PIN");
    settingsStore.update((settings) => {
      return { ...settings, boardType: MicroControllerType.ARDUINO_UNO };
    });
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
