import { StateGenerator } from '../../state.factories';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import {
  PinState,
  PinPicture,
  PIN_TYPE
} from '../../../state/arduino-components.state';

import _ from 'lodash';
import { ArduinoComponentType } from '../../../state/arduino.state';
import { arduinoStateByComponent } from '../../factory.helpers';

export const led: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS;
  const state = findFieldValue(block, 'STATE') === 'ON' ? 1 : 0;
  const ledState: PinState = {
    pin,
    pins: [pin],
    state,
    pinPicture: PinPicture.LED,
    type: ArduinoComponentType.PIN,
    pinType: PIN_TYPE.DIGITAL_OUTPUT
  };

  const explanation = `Turn led ${pin} ${state === 1 ? 'on' : 'off'}.`;

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      ledState,
      explanation,
      previousState
    )
  ];
};
