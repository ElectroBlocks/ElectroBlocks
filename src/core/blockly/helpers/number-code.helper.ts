import _ from "lodash";

export const numberToCode = (num: string) => {
  if (_.isNumber(num)) {
    return +num > 0 ? +num - 1 : 0;
  }

  return `(${num} - 1)`;
};
