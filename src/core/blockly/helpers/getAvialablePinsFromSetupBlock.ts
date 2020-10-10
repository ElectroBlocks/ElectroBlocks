import { getBlocksByName } from "./block.helper";
import _ from "lodash";

export const configuredPins = (
  setupBlockType: string,
  potentialListOfPins: string[][]
) => {
  const pins = getBlocksByName(setupBlockType).map((block) => [
    block.getFieldValue("PIN"),
    block.getFieldValue("PIN"),
  ]);

  if (pins.length === 0) {
    return potentialListOfPins;
  }

  return pins || [["NO_PINS", "NO_PINS"]];
};

export const getAvailablePins = (
  setupBlockType: string,
  selectedPin: string,
  potentialListOfPins: string[][]
) => {
  const takenPins = configuredPins(setupBlockType, potentialListOfPins);
  if (_.isEqual(potentialListOfPins, takenPins)) {
    return potentialListOfPins;
  }

  const takenPinSingle = takenPins.map(([pin]) => pin);

  const pinList = potentialListOfPins.filter(
    ([pin]) => !takenPinSingle.includes(pin) || pin === selectedPin
  );

  if (_.isEmpty(pinList)) {
    return [["NO_PINS", "NO_PINS"]];
  }

  return pinList;
};
