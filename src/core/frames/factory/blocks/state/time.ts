import { StateGenerator } from '../../state.factories';
import { TimeState } from '../../../arduino-components.state';
import { ArduinoComponentType } from '../../../arduino.frame';
import { arduinoStateByComponent } from '../../factory.helpers';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';

export const timeSetup: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const timeComonent: TimeState = {
    pins: block.pins,
    timeInSeconds: +findFieldValue(block, 'time_in_seconds'),
    type: ArduinoComponentType.TIME,
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      timeComonent,
      'Setting up Arduino time.',
      previousState
    ),
  ];
};
