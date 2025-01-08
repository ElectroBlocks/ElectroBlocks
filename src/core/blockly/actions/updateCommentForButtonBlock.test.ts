import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { ActionType, CommentForButtonBlockAction } from "./actions";
import { updateCommentIsButtonPressedBlock } from "./updateCommentForButtonBlock";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import type { Workspace } from "blockly";
import "../blocks";

describe("updateCommentIsButtonPressedBlock", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should return an empty array if no button blocks are present", () => {
    const event = createTestEvent(arduinoBlock.id);

    expect(updateCommentIsButtonPressedBlock(event)).toEqual([]);
  });

  it("should return correct comment for button with pullup resistor", () => {
    const buttonSetupBlock = createButtonSetupBlock(true);
    const isButtonPressedBlock = createIsButtonPressedBlock(buttonSetupBlock);
    const event = createTestEvent(arduinoBlock.id);

    const expectedAction: CommentForButtonBlockAction = {
      blockId: isButtonPressedBlock.id,
      type: ActionType.UPDATE_COMMENT_FOR_BUTTON_BLOCK,
      comment: "Checks if the state of the defined pin is LOW",
    };

    expect(updateCommentIsButtonPressedBlock(event)).toEqual([expectedAction]);
  });

  it("should return correct comment for button without pullup resistor", () => {
    const buttonSetupBlock = createButtonSetupBlock(false);
    const isButtonPressedBlock = createIsButtonPressedBlock(buttonSetupBlock);
    const event = createTestEvent(arduinoBlock.id);

    const expectedAction: CommentForButtonBlockAction = {
      blockId: isButtonPressedBlock.id,
      type: ActionType.UPDATE_COMMENT_FOR_BUTTON_BLOCK,
      comment: "Checks if the state of the defined pin is HIGH",
    };

    expect(updateCommentIsButtonPressedBlock(event)).toEqual([expectedAction]);
  });

  const createButtonSetupBlock = (isPullupResistor: boolean) => {
    const buttonSetupBlock = workspace.newBlock("button_setup");
    buttonSetupBlock.setFieldValue(
      isPullupResistor ? "TRUE" : "FALSE",
      "PULLUP_RESISTOR"
    );
    return buttonSetupBlock;
  };

  const createIsButtonPressedBlock = (buttonSetupBlock) => {
    const isButtonPressedBlock = workspace.newBlock("is_button_pressed");
    isButtonPressedBlock.setFieldValue(
      buttonSetupBlock.getFieldValue("PIN"),
      "PIN"
    );
    return isButtonPressedBlock;
  };
});
