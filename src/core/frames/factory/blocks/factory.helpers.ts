import {
  ArduinoState,
  Timeline,
  ArduinoComponentState,
  Variable
} from '../../state/arduino.state';

import _ from 'lodash';

export const arduinoStateByVariable = (
  blockId: string,
  timeline: Timeline,
  newVariable: Variable,
  explanation: string,
  previousState: ArduinoState = undefined,
  txLedOn = false,
  rxLedOn = false,
  delay = 0
) => {
  const variables = previousState ? _.cloneDeep(previousState.variables) : {};
  variables[newVariable.name] = newVariable;

  const components = previousState ? _.cloneDeep(previousState.components) : [];

  return {
    blockId,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    rxLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true
  };
};

export const arduinoStateByComponent = (
  blockId: string,
  timeline: Timeline,
  newComponent: ArduinoComponentState,
  explanation: string,
  previousState: ArduinoState = undefined,
  txLedOn = false,
  rxLedOn = false,
  delay = 0
): ArduinoState => {
  const variables = previousState ? { ...previousState.variables } : {};
  const previousComponents = previousState ? [...previousState.components] : [];

  const components = [
    ...previousComponents.filter(
      (c) =>
        c.type !== newComponent.type && _.isEqual(c.pins, newComponent.pins)
    ),
    newComponent
  ];

  return {
    blockId,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    rxLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true
  };
};
