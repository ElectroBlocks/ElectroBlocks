import _ from "lodash";
import type { BlockEvent } from "../dto/event.type";
import { ActionType, type DisableBlock } from "./actions";
import { Settings } from "../../../firebase/model";
import { SUPPORTED_LANGUAGES } from "../../microcontroller/microcontroller";

// This will disable blocks that require a setup block to run
// If there are more than 2 setup blocks it will disable all the blocks
// if multiple blocks are not allowed.  Example would be it would disable
// RFID block because only one RFID component is allowed but would not do
// The same for the button block
export const disableRecievingMessageBlocksForLiveModeAndPython = (
  event: BlockEvent,
  settingData: Settings,
  isLiveMode: boolean = false
): DisableBlock[] => {
  const { blocks } = event;
  if (!blocks.find(x => x.blockName == 'message_setup')) {
    return []
  }

  return blocks
    .filter((b) => ['arduino_get_message', 'arduino_receive_message'].includes(b.blockName))
    .map((b) => {
      return {
        blockId: b.id,
        type: isLiveMode || settingData.language == SUPPORTED_LANGUAGES.PYTHON ?  ActionType.DISABLE_BLOCK : ActionType.ENABLE_BLOCK,
        warningText: `Not available in Python or Live mode yet. You can still use Print to show messages.`,
        stopCompiling: isLiveMode || settingData.language == SUPPORTED_LANGUAGES.PYTHON,
      };
    });
};
