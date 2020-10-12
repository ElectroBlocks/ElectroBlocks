import { getBlockByType } from './block.helper';

/**
 * Shows the number of times to go through the arduino loop block
 */
export const arduinoLoopBlockShowNumberOfTimesThroughLoop = () => {
  const block = getBlockByType('arduino_loop');
  block.inputList[0].setVisible(false);
  block.inputList[1].setVisible(true);
  block.render();
  return;
};

/**
 * Shows the forever text in the arduino loop block
 */
export const arduinoLoopBlockShowLoopForeverText = () => {
  const block = getBlockByType('arduino_loop');

  block.inputList[0].setVisible(true);
  block.inputList[1].setVisible(false);
  block.render();
};

export const getTimesThroughLoop = (): number => {
  return +getBlockByType('arduino_loop').getFieldValue('LOOP_TIMES');
};

export const isArduinoLoopBlockId = (id: string) => {
  return getBlockByType('arduino_loop').id === id;
}
