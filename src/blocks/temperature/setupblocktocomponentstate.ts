import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { TemperatureState, TempSensor } from "./state";

export const temperatureSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): TemperatureState => {
  const tempSensor = findSensorState<TempSensor>(block, timeline);
  const type = findFieldValue(block, "TYPE");
  const pin = findFieldValue(block, "PIN");
  return {
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
    pins: [pin],
    temperature: tempSensor.temp,
    humidity: tempSensor.humidity,
    tempType: type,
    setupCommand: `register::dht::${pin}::${type == "DHT11" ? 1 : 2}`,
  };
};

export const tempStateStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
): TemperatureState => {
  const block = blocks.find((b) => b.blockName == "temp_setup");
  const pin = findFieldValue(block, "PIN") as ARDUINO_PINS;
  const type = findFieldValue(block, "TYPE");
  console.log(sensorStr, "sensor string");
  const [_, pinState, state] = sensorStr.split(":");
  const [humidity, temp] = state.split("-");
  return {
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
    pins: [pin],
    temperature: +temp,
    humidity: +humidity,
    tempType: type,
    setupCommand: `register::dht::${pin}::${type == "DHT11" ? 1 : 2}`,
    enableFlag: "ENABLE_DHT",
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
  };
};
