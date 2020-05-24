import { StateGenerator } from '../state.factories';
import { ButtonState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';
import { ButtonSensor } from '../../../blockly/dto/sensors.data';
import { arduinoStateByComponent } from '../factory.helpers';

export const buttonSetup: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const btnDatum = JSON.parse(block.metaData) as ButtonSensor[];
  const btnData = btnDatum.find((d) => d.loop === 1);

  const [pin] = block.pins;

  const buttonState: ButtonState = {
    type: ArduinoComponentType.BUTTON,
    pins: block.pins,
    isPressed: btnData.is_pressed,
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      buttonState,
      `button ${pin} is being setup.`
    ),
  ];
};
