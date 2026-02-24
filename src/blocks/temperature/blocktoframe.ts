import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { TemperatureState, TempSensor } from "./state";

export const tempSetupSensor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorDatum = JSON.parse(block.metaData) as TempSensor[];
  const sensorData = sensorDatum.find((d) => d.loop === 1) as TempSensor;
  const type = findFieldValue(block, "TYPE");
  const tempSensorState: TemperatureState = {
    pins: block.pins,
    temperature: sensorData.temp,
    humidity: sensorData.humidity,
    tempType: type,
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
    setupCommand: `register::dht::${block.pins[0]}::${type == "DHT11" ? 1 : 2}`,
    importLibraries: [
      {
        name: "DHT sensor library",
        version: "latest",
        deps: ["Adafruit Unified Sensor"],
        url: "https://downloads.arduino.cc/libraries/github.com/adafruit/DHT_sensor_library-1.4.6.zip",
      },
      {
        name: "Adafruit Unified Sensor",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/adafruit/Adafruit_Unified_Sensor-1.1.14.zip",
      },
    ],
    enableFlag: "ENABLE_DHT",
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      tempSensorState,
      "Setting up temperature sensor.",
      previousState
    ),
  ];
};
