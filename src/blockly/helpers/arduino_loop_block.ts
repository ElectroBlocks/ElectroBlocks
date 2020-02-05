
import { getBlockByName, createBlock } from './workspace';



/**
 * Shows the number of times to go through the arduino loop block
 */
const arduinoLoopBlockShowNumberOfTimesThroughLoop = () => {
  const block = getBlockByName('arduino_loop');

  block.inputList[0].setVisible(false);
  block.inputList[1].setVisible(true);
  block.render();
  return;
};

/**
 * Shows the forever text in the arduino loop block
 */
const arduinoLoopBlockShowLoopForeverText = () => {
  const block = getBlockByName('arduino_loop')

  block.inputList[0].setVisible(true);
  block.inputList[1].setVisible(false);
  block.render();
};

export {
  arduinoLoopBlockShowNumberOfTimesThroughLoop,
  arduinoLoopBlockShowLoopForeverText
};
