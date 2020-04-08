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
import { getInputValue } from '../../value.factories';

export const analogWrite = (
  pinPicture: PinPicture,
  connectionValueName: string
) => {
  return (blocks, block, variables, timeline, previousState) => {
    const pin = findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS;
    const pinWord = pinPicture == PinPicture.LED ? 'led' : 'pin';
    const state = getInputValue(
      blocks,
      block,
      variables,
      timeline,
      connectionValueName,
      1,
      previousState
    );

    const ledState: PinState = {
      pin,
      pins: [pin],
      state,
      pinPicture,
      type: ArduinoComponentType.PIN,
      pinType: PIN_TYPE.ANALOG_OUTPUT
    };

    const explanation = `Setting ${pinWord} ${pin}${
      pinWord == 'led' ? ' to fade' : ''
    } to ${state}.`;

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
};

export const digitalWrite = (pinPicture: PinPicture) => {
  return (blocks, block, variables, timeline, previousState) => {
    const pin = findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS;
    const pinWord = pinPicture == PinPicture.LED ? 'led' : 'pin';
    const state = findFieldValue(block, 'STATE') === 'ON' ? 1 : 0;
    const ledState: PinState = {
      pin,
      pins: [pin],
      state,
      pinPicture,
      type: ArduinoComponentType.PIN,
      pinType: PIN_TYPE.DIGITAL_OUTPUT
    };

    const explanation = `Turn ${pinWord} ${pin} ${state === 1 ? 'on' : 'off'}.`;

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
};
