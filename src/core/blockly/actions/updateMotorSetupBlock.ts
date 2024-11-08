import { BlockEvent } from "../dto/event.type";
import { findFieldValue } from "../helpers/block-data.helper";
import { ActionType, UpdateMotorSetupBlock } from "./actions";

export const updateMotorSetupBlock = (
  event: BlockEvent
): UpdateMotorSetupBlock[] => {
  const { blocks, blockId } = event;

  const block = blocks.find((block) => block.id === blockId);

  // If the block is not found it means it was deleted.
  if (!block) {
    return [];
  }

  if (!["motor_setup", "move_motor", "stop_motor"].includes(block.blockName)) {
    return [];
  }

  const motorSetupBlock = blocks.find((b) => b.blockName == "motor_setup");
  const numberOfMotors = +findFieldValue(motorSetupBlock, "NUMBER_OF_MOTORS");

  return [
    {
      blockId: blockId,
      showMotorTwo: numberOfMotors > 1,
      type: ActionType.UPDATE_MOTOR_SETUP_BLOCK,
    },
  ];
};
