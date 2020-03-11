import { StateGenerator } from '../../state.factories';
import { TimeState } from '../../../state/arduino-components.state';
import { ArduinoComponentType } from '../../../state/arduino.state';
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
    type: ArduinoComponentType.TIME
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      timeComonent,
      'Setting up Arduino time.',
      previousState
    )
  ];
};
