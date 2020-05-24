import { ValueGenerator } from '../value.factories';
import { findComponent } from '../factory.helpers';
import { ArduinoComponentType } from '../../arduino.frame';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { ButtonState } from '../../arduino-components.state';

export const isButtonPressed: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<ButtonState>(
    previousState,
    ArduinoComponentType.BUTTON,
    findFieldValue(block, 'PIN')
  ).isPressed;
};
