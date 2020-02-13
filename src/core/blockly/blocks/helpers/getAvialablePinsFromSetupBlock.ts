import selectedBoard from '../../../../constants/arduino';
import { getBlocksByName } from '../../helpers/block.helper';

const getAvialablePinsFromSetupBlock = (setupBlockType: string) => {
  const pins = getBlocksByName(setupBlockType).map((block) => [
    block.getFieldValue('PIN'),
    block.getFieldValue('PIN')
  ]);

  if (pins.length === 0) {
    return selectedBoard().digitalPins;
  }

  return pins;
};

export default getAvialablePinsFromSetupBlock;
