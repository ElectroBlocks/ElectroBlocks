import { ValueGenerator } from '../../value.factories';
import { TimeState } from '../../../state/arduino-components.state';
import { ArduinoComponentType } from '../../../state/arduino.state';

export const timeSeconds: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const timeState = previousState.components.find(
    c => c.type === ArduinoComponentType.TIME
  ) as TimeState;

  return (
    Math.floor(Math.round(timeline.iteration * timeState.timeInSeconds * 100)) /
    100
  );
};
