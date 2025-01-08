import { b } from "vitest/dist/suite-KPWE530F.js";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { ThermistorState } from "./state";

export const thermistorRead: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const state = findComponent<ThermistorState>(
    previousState,
    ArduinoComponentType.THERMISTOR
  );
  return findFieldValue(block, "UNIT") == "C" ? state.tempC : state.tempF;
};
