import { ValueGenerator } from '../block-to-value.factories';
import { findComponent } from '../frame-transformer.helpers';
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
