import { StateGenerator } from './state.factories';
import { ButtonState } from '../state/arduino-components.state';
import { ArduinoComponentType } from '../state/arduino.state';
import { getSensorData } from '../../blockly/transformers/sensor-data.transformer';
import { ButtonSensor } from '../../blockly/state/sensors.state';
import { createArduinoState } from './factory.helpers';

export const buttonSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const sensorData = getSensorData(blocks);
  const btnData = sensorData.find(
    (d) => d.loop == 1 && d.blockName === 'button_setup'
  ) as ButtonSensor;

  const [pin] = block.pins;

  const buttonState: ButtonState = {
    type: ArduinoComponentType.BUTTON,
    pins: block.pins,
    isPressed: btnData.is_pressed
  };

  return [
    createArduinoState(block.id, timeline, buttonState, `button ${pin} is being setup.`)
  ]
};
