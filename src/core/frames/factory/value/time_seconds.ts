import { ValueGenerator } from '../value.factories';
import { TimeState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';

export const timeSeconds: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const timeState = previousState.components.find(
    (c) => c.type === ArduinoComponentType.TIME
  ) as TimeState;

  return Math.floor(Math.round(timeState.timeInSeconds * 100)) / 100;
};
