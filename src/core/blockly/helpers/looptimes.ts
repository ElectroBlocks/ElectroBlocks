import { getTimesThroughLoop } from "./arduino_loop_block.helper";
import _ from "lodash";

const loopTimes = () => {
  // Reason for +1 is because it does not include end number
  return _.range(1, getTimesThroughLoop() + 1).map((loop) => {
    return [loop.toString(), loop.toString()];
  });
};
export default loopTimes;
