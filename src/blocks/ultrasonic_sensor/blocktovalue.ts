import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { UltraSonicSensorState } from "./state";

export const ultraSonicSensorDistance: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<UltraSonicSensorState>(
    previousState,
    ArduinoComponentType.ULTRASONICE_SENSOR
  ).cm;
};
