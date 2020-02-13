import { getAllBlocks } from '../helpers/block.helper';

export const checkRightPinSelected = (
  sensorReadBlockTypes: string[],
  setupBlockType: string
) => {
  const allBlocks = getAllBlocks();
  const sensorReadBlocks = allBlocks.filter((block) =>
    sensorReadBlockTypes.includes(block.type)
  );

  const availablePins = allBlocks
    .filter((block) => block.type === setupBlockType)
    .map((block) => block.getFieldValue('PIN'));

  if (availablePins.length === 0) {
    return;
  }
  sensorReadBlocks.forEach((block) => {
    if (!availablePins.includes(block.getFieldValue('PIN'))) {
      block.setWarningText('Please select another pin number.');
      block.setDisabled(true);
    } else {
      block.setWarningText(null);
    }
  });
};
