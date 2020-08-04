import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { IRRemoteState } from '../../arduino-components.state';
import { IRRemoteSensor } from '../../../blockly/dto/sensors.type';
import { ArduinoComponentType } from '../../arduino.frame';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { arduinoFrameByComponent } from '../frame-transformer.helpers';

export const irRemoteSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const irRemoteSensorDatum = JSON.parse(block.metaData) as IRRemoteSensor[];

  const irRemoteData = irRemoteSensorDatum.find(
    (d) => d.loop == 1
  ) as IRRemoteSensor;
  const [analogPin] = block.pins;
  const irRemoteState: IRRemoteState = {
    hasCode: irRemoteData.scanned_new_code,
    code: irRemoteData.code,
    type: ArduinoComponentType.IR_REMOTE,
    pins: block.pins,
    analogPin,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      irRemoteState,
      'Setting up ir remote.',
      previousState
    ),
  ];
};
