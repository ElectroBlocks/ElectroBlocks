import type { BlockEvent } from "../dto/event.type";
import { findFieldValue } from "../helpers/block-data.helper";
import { ActionType, type UpdateLCDScreenPrintBlock } from "./actions";

const UpdateLCDScreenPrintBlock = (
  blockEvent: BlockEvent
): UpdateLCDScreenPrintBlock[] => {
  const lcdSetupBlock = blockEvent.blocks.find(
    (b) => b.blockName == "lcd_setup"
  );
  if (!lcdSetupBlock) {
    return [];
  }
  const rows = findFieldValue(lcdSetupBlock, "SIZE") === "20 x 4" ? 4 : 2;

  const lcdScreenPrintBlocks = blockEvent.blocks.filter(
    (block) => block.blockName === "lcd_screen_simple_print"
  );

  return lcdScreenPrintBlocks.map((b) => {
    const update: UpdateLCDScreenPrintBlock = {
      type: ActionType.LCD_SIMPLE_PRINT_CHANGE,
      numberOfRows: rows,
      blockId: b.id,
    };
    return update;
  });
};

export default UpdateLCDScreenPrintBlock;
