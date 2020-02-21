import { StateGenerator } from './state.factories';
import { ButtonState } from '../state/arduino-components.state';
import { ArduinoComponentType } from '../state/arduino.state';
import { ButtonSensor } from '../../blockly/state/sensors.state';
import { createArduinoState } from './factory.helpers';

export const buttonSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const btnDatum = JSON.parse(block.metaData) as ButtonSensor[];
  const btnData = btnDatum.find(d => d.loop === 1);

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
