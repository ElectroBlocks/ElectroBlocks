import { getBlockByName } from '../../helpers/workspace';

const loopTimes = () => {
  const arduinoLoopBlock = getBlockByName('arduino_loop');

  const numberOfTimesThroughTheLoop = +arduinoLoopBlock.getFieldValue(
    'LOOP_TIMES'
  );

  const options: Array<[string, string]> = [];
  for (let i = 1; i <= numberOfTimesThroughTheLoop; i += 1) {
    options.push([i.toString(), i.toString()]);
  }
  return options;
};
export default loopTimes;
