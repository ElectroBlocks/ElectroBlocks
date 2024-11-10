import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import Blockly, { BlockSvg } from "blockly";
import { getAllBlocks } from "../helpers/block.helper";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import { ActionType, UpdateComponentSetupBlock } from "./actions";
import { updateMotorSetupBlock } from "./updateMotorSetupBlock";

describe("changeNumberOfComponentsInSetupBlock", () => {
  let workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should hide/show based on the number of motors the user set.", () => {
    // Hide the motors
    const motorSetupBlock = workspace.newBlock("motor_setup");
    motorSetupBlock.setFieldValue("1", "NUMBER_OF_COMPONENTS");
    const event = createTestEvent(motorSetupBlock.id);
    expect(updateMotorSetupBlock(event)).toEqual([
      {
        blockId: motorSetupBlock.id,
        showMotorTwo: false,
        type: ActionType.UPDATE_MULTIPLE_SETUP_BLOCK,
      },
    ]);

    // Show the motors
    motorSetupBlock.setFieldValue("2", "NUMBER_OF_COMPONENTS");
    const event2 = createTestEvent(motorSetupBlock.id);
    expect(updateMotorSetupBlock(event2)).toEqual([
      {
        blockId: motorSetupBlock.id,
        showMotorTwo: true,
        type: ActionType.UPDATE_MULTIPLE_SETUP_BLOCK,
      },
    ]);
  });
});
