import type { BlockEvent } from "../../dto/event.type";
import { ActionType, DisableBlock } from "../actions";

// This is so that when some switches microcontrollers the pins are
// valid in the new microcontroller.  Otherwise disable the pins and force
// the user to choose a valid option.
export const disableBlocksWithInvalidPinNumbers = (
  event: BlockEvent
): DisableBlock[] => {
  return event.blocks
    .filter((b) =>
      b.pins.find((p) => {
        // This makes sure that all the pins in the drop down box match
        // the pins in being output
        return !b.fieldValues
          .filter((fv) => fv.validOptions)
          .reduce((acc, next) => {
            return [...acc, ...next.validOptions.map((v) => v.value)];
          }, [])
          .includes(p);
      })
    )
    .map((block) => {
      return {
        type: ActionType.DISABLE_BLOCK,
        warningText:
          "Pin is not avialable for the microcontroller you are using.",
        blockId: block.id,
        stopCompiling: true,
      };
    });
};
