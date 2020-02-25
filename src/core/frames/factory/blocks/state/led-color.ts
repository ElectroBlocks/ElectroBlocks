import { StateGenerator } from '../../state.factories';
import { arduinoStateByComponent } from '../../factory.helpers';
import { LedColorState } from '../../../state/arduino-components.state';
import { ArduinoComponentType } from '../../../state/arduino.state';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';

export const ledColorSetup: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const [redPin, greenPin, bluePin] = findFieldValue(block, 'WIRE').split('-');
  const pictureType = findFieldValue(block, 'PICTURE_TYPE');
  const ledColorState: LedColorState = {
    type: ArduinoComponentType.NEO_PIXEL_STRIP,
    pins: block.pins,
    redPin,
    greenPin,
    bluePin,
    color: { green: 0, red: 0, blue: 0 },
    pictureType
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      ledColorState,
      'Setting up color led.',
      previousState
    )
  ];
};
