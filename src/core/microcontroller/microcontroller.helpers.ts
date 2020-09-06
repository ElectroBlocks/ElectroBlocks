export const pinArrayToFieldList = (pins: string[]) => {
  return pins.map((pin) => [pin, pin]);
};
