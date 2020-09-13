import { ValueGenerator } from "../block-to-value.factories";
import { findComponent } from "../frame-transformer.helpers";
import { PinState } from "../../arduino-components.state";
import { ArduinoComponentType } from "../../arduino.frame";
import { findFieldValue } from "../../../blockly/helpers/block-data.helper";

export const getPinState: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const component = findComponent<PinState>(
    previousState,
    ArduinoComponentType.PIN,
    findFieldValue(block, "PIN")
  );

  if (component) {
    return component.state;
  }

  console.log(findFieldValue(block, "PIN"), block, "PIN NOT FOUND");

  throw new Error("Component PinState Not Found");
};
