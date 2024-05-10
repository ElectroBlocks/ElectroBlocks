import { MenuOption } from "blockly";
import { getTimesThroughLoop } from "./arduino_loop_block.helper";
import _ from "lodash";

const loopTimes = () => {
  // Reason for +1 is because it does not include end number
  return _.range(1, getTimesThroughLoop() + 1).map((loop) => {
    const menuOption: MenuOption = [loop.toString(), loop.toString()];
    return menuOption;
  });
};
export default loopTimes;
