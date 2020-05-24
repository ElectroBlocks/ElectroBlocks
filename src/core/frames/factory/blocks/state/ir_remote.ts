import { StateGenerator } from '../../state.factories';
import { IRRemoteState } from '../../../arduino-components.state';
import { IRRemoteSensor } from '../../../../blockly/state/sensors.state';
import { ArduinoComponentType } from '../../../arduino.frame';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import { arduinoStateByComponent } from '../../factory.helpers';

export const irRemoteSetup: StateGenerator = (
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
    arduinoStateByComponent(
      block.id,
      timeline,
      irRemoteState,
      'Setting up ir remote.'
    ),
  ];
};
