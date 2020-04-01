import { ValueGenerator } from '../../value.factories';
import { getSensorForLoop } from '../../factory.helpers';
import { PinState } from '../../../state/arduino-components.state';
import { PinSensor } from '../../../../blockly/state/sensors.state';

export const getPinState = (setupBlockType: string): ValueGenerator => {
  return (blocks, block, variables, timeline, previousState) => {
    return getSensorForLoop<PinSensor>(blocks, timeline, setupBlockType).state;
  };
};
