import type { Timeline } from "../../frames/arduino.frame";
import type { BlockData } from "../dto/block.type";
import type { Sensor } from "../dto/sensors.type";

export const findSensorState = <S extends Sensor>(
  block: BlockData,
  timeline: Timeline
): S => {
  const sensorStates = JSON.parse(block.metaData) as S[];

  return sensorStates.find((s) => {
    return (
      s.loop === timeline.iteration ||
      ((timeline.function === "pre-setup" || timeline.function === "setup") &&
        s.loop === 1)
    );
  }) as S;
};
