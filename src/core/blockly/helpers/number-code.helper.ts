import { isNumber } from "lodash";

export const numberToCode = (num: string) => {
  if (isNumber(num)) {
    return +num > 0 ? +num - 1 : 0;
  }

  return `(${num} - 1)`;
};
