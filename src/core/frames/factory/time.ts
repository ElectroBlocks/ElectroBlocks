import { StateGenerator } from './state.factories';
import { TimeState } from '../state/arduino-components.state';
import { ArduinoComponentType } from '../state/arduino.state';
import { createArduinoState } from './factory.helpers';
import { findFieldValue } from '../../blockly/helpers/block-data.helper';

export const timeSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const messageComponent: TimeState = {
    pins: block.pins,
    timeInSeconds: +findFieldValue(block, 'time_in_seconds'),
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
