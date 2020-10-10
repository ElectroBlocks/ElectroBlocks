import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.defineBlocksWithJsonArray([
  {
    type: "board_selector",
    message0: "Select Board %1 %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "field_dropdown",
        name: "boardtype",
        options: [
          ["Arduino Uno", "uno"],
          ["Arduino Mega", "mega"],
        ],
      },
    ],
    colour: COLOR_THEME.ARDUINO_START_BLOCK,
    tooltip: "",
    helpUrl: "",
  },
]);
