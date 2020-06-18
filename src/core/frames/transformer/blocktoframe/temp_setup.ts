import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { MotionSensor, TempSensor } from '../../../blockly/dto/sensors.type';
import { TemperatureState } from '../../arduino-components.state';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { ArduinoComponentType } from '../../arduino.frame';
import { arduinoFrameByComponent } from '../frame-transformer.helpers';

export const tempSetupSensor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorDatum = JSON.parse(block.metaData) as TempSensor[];
  const sensorData = sensorDatum.find((d) => d.loop === 1) as TempSensor;

  const tempSensorState: TemperatureState = {
    pins: block.pins,
    temperature: sensorData.temp,
    humidity: sensorData.humidity,
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      tempSensorState,
      'Setting up temperature sensor.'
    ),
  ];
};
