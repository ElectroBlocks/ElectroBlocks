import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { arduinoStateByComponent, findComponent } from '../frame-transformer.helpers';
import { LedColorState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { getInputValue } from '../block-to-value.factories';

export const ledColorSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const [redPin, greenPin, bluePin] = findFieldValue(block, 'WIRE').split('-');
  const pictureType = findFieldValue(block, 'PICTURE_TYPE');
  const ledColorState: LedColorState = {
    type: ArduinoComponentType.LED_COLOR,
    pins: block.pins,
    redPin,
    greenPin,
    bluePin,
    color: { green: 0, red: 0, blue: 0 },
    pictureType,
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      ledColorState,
      'Setting up color led.',
      previousState
    ),
  ];
};

export const setLedColor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const color = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'COLOUR',
    { red: 0, green: 0, blue: 0 },
    previousState
  );

  const ledColor = findComponent<LedColorState>(
    previousState,
    ArduinoComponentType.LED_COLOR
  );
  const newComponent = { ...ledColor, color };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Setting led color to [red=${color.red},green=${color.green},blue=${color.blue}].`,
      previousState
    ),
  ];
};
