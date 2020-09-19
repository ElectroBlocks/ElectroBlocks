import { getBoard } from "../../../../microcontroller/selectBoard";
import { BlockEvent } from "../../../dto/event.type";
import { getBoardType } from "../../../helpers/get-board.helper";
import { ActionType, DisableBlock } from "../../actions";

export const disableBlocksWithInvalidPinNumbers = (
  event: BlockEvent
): DisableBlock[] => {
  const board = getBoard(getBoardType());
  const availablePins = [...board.digitalPins, ...board.analonPins];
  return event.blocks
    .filter((b) =>
      b.pins.find((p) => {
        return !availablePins.includes(p);
      })
    )
    .map((block) => {
      return {
        type: ActionType.DISABLE_BLOCK,
        warningText:
          "Pin is not avialable for the microcontroller you are using.",
        blockId: block.id,
      };
    });
};
