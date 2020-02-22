import { NeoPixelState } from '../../state/arduino-components.state';
import { ArduinoComponentType } from '../../state/arduino.state';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import _ from 'lodash';
import { arduinoStateByComponent } from './factory.helpers';
import { StateGenerator } from '../state.factories';

export const neoPixelSetup: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const numberOfLeds = +findFieldValue(block, 'NUMBER_LEDS');

  const ledStripState: NeoPixelState = {
    pins: block.pins,
    type: ArduinoComponentType.NEO_PIXEL_STRIP,
    numberOfLeds,
    neoPixels: _.range(0, numberOfLeds).map((i) => {
      return {
        position: i,
        color: {
          red: 0,
          green: 0,
          blue: 0
        }
      };
    })
  };
  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      ledStripState,
      'Setting up led light strip.',
      previousState
    )
  ];
};
