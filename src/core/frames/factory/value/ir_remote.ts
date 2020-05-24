import { ValueGenerator } from '../value.factories';
import { findComponent } from '../factory.helpers';
import { IRRemoteState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';

export const irRemoteHasCode: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<IRRemoteState>(
    previousState,
    ArduinoComponentType.IR_REMOTE
  ).hasCode;
};

export const irRemoteGetCode: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<IRRemoteState>(
    previousState,
    ArduinoComponentType.IR_REMOTE
  ).code;
};
