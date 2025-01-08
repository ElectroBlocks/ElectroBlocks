import { ArduinoComponentType } from "../../frames/arduino.frame";
import { BlockEvent } from "../dto/event.type";
import { findFieldValue } from "../helpers/block-data.helper";
import { ActionType, UpdateComponentSetupBlock } from "./actions";

export const updateWhichComponent =
  (
    setupBlockName: string,
    blocksToMonitor: string[],
    type: ArduinoComponentType
  ) =>
  (event: BlockEvent): UpdateComponentSetupBlock[] => {
    const { blocks, blockId } = event;

    const block = blocks.find((block) => block.id === blockId);
    // If the block is not found it means it was deleted.
    if (!block) {
      return [];
    }

    if (!blocksToMonitor.includes(block.blockName)) {
      return [];
    }

    const setupBlock = blocks.find((b) => setupBlockName == b.blockName);
    if (!setupBlock) {
      return [];
    }
    const numberOfComponents = +findFieldValue(
      setupBlock,
      "NUMBER_OF_COMPONENTS"
    );
    return [
      {
        blockId: blockId,
        numberOfComponents: numberOfComponents,
        type: ActionType.UPDATE_MULTIPLE_SETUP_BLOCK,
        componentType: type,
      },
    ];
  };
