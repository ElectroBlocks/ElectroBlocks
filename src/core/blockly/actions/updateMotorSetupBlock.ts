import { ArduinoComponentType } from "../../frames/arduino.frame";
import { BlockEvent } from "../dto/event.type";
import { findFieldValue } from "../helpers/block-data.helper";
import { ActionType, UpdateComponentSetupBlock } from "./actions";

export const updateMotorSetupBlock = (
  event: BlockEvent
): UpdateComponentSetupBlock[] => {
  const { blocks, blockId } = event;

  const block = blocks.find((block) => block.id === blockId);

  // If the block is not found it means it was deleted.
  if (!block) {
    return [];
  }

  if (
    ![
      "motor_setup",
      "move_motor",
      "stop_motor",
      "rgb_led_setup",
      "set_color_led",
    ].includes(block.blockName)
  ) {
    return [];
  }

  const setupBlock = blocks.find((b) =>
    ["rgb_led_setup", "motor_setup"].includes(b.blockName)
  );
  const numberOfComponents = +findFieldValue(
    setupBlock,
    "NUMBER_OF_COMPONENTS"
  );
  return [
    {
      blockId: blockId,
      numberOfComponents: numberOfComponents,
      type: ActionType.UPDATE_MULTIPLE_SETUP_BLOCK,
      componentType: setupBlockToArduinoType(block.blockName),
    },
  ];
};

function setupBlockToArduinoType(blockType: string) {
  switch (blockType) {
    case "motor_setup":
    case "move_motor":
    case "stop_motor":
      return ArduinoComponentType.MOTOR;
    case "rgb_led_setup":
    case "set_color_led":
      return ArduinoComponentType.LED_COLOR;
    default:
      return ArduinoComponentType.MOTOR;
  }
}
