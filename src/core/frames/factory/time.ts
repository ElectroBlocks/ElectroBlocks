import { StateGenerator } from './state.factories';
import { TimeState } from '../state/arduino-components.state';
import { ArduinoComponentType } from '../state/arduino.state';
import { createArduinoState } from './factory.helpers';

export const timeSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const messageComponent: TimeState = {
    pins: block.pins,
    timeInSeconds: +block.fieldValues.find(f => f.name == 'time_in_seconds').value,
    type: ArduinoComponentType.TIME
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      messageComponent,
      'Setting up Arduino time.',
      previousState
    )
  ];
};
