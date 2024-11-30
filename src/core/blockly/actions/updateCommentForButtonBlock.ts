import { BlockEvent } from "../dto/event.type";
import { findFieldValue } from "../helpers/block-data.helper";
import { ActionType, CommentForButtonBlockAction } from "./actions";

export const updateCommentIsButtonPressedBlock = (
  blockEvent: BlockEvent
): CommentForButtonBlockAction[] => {
  const buttonSetupBlocks = blockEvent.blocks.filter(
    (block) => block.blockName === "button_setup"
  );

  const pullupResistorButtonMessage =
    "Checks if the state of the defined pin is LOW";
  const buttonMessage = "Checks if the state of the defined pin is HIGH";

  const pinsToMessages = buttonSetupBlocks.reduce((acc, block) => {
    const pin = findFieldValue(block, "PIN");
    const isPullupResistor =
      findFieldValue(block, "PULLUP_RESISTOR") === "TRUE";
    acc[pin] = isPullupResistor ? pullupResistorButtonMessage : buttonMessage;
    return acc;
  }, {});

  return blockEvent.blocks
    .filter((block) => block.blockName === "is_button_pressed")
    .map((block) => {
      const pin = findFieldValue(block, "PIN");
      const comment = pinsToMessages[pin];
      return {
        blockId: block.id,
        type: ActionType.UPDATE_COMMENT_FOR_BUTTON_BLOCK,
        comment,
      };
    });
};
