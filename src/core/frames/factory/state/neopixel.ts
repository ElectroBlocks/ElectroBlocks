import { NeoPixelState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import _ from 'lodash';
import {
  arduinoStateByComponent,
  findComponent,
  getDefaultIndexValue,
} from '../factory.helpers';
import { StateGenerator } from '../state.factories';
import { getInputValue } from '../value.factories';

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
          blue: 0,
        },
      };
    }),
  };
  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      ledStripState,
      'Setting up led light strip.',
      previousState
    ),
  ];
};

export const setNeoPixelColor: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const neoPixel = findComponent<NeoPixelState>(
    previousState,
    ArduinoComponentType.NEO_PIXEL_STRIP
  );
  const color = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'COLOR',
    { red: 0, green: 0, blue: 0 },
    previousState
  );
  const position = getDefaultIndexValue(
    1,
    Infinity,
    getInputValue(
      blocks,
      block,
      variables,
      timeline,
      'POSITION',
      1,
      previousState
    )
  );
  neoPixel.neoPixels[position - 1] = { position: position - 1, color };
  const newComponent = _.cloneDeep(neoPixel);

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Setting LED ${position} on light strip to color [red=${color.red},green=${color.green},blue=${color.blue}]`,
      previousState
    ),
  ];
};
