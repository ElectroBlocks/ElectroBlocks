import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { TimeState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';
import { arduinoStateByComponent } from '../frame-transformer.helpers';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

export const timeSetup: BlockToFrameTransformer = (
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
      block.blockName,
      timeline,
      timeComonent,
      'Setting up Arduino time.',
      previousState
    ),
  ];
};
