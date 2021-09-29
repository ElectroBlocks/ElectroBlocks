import settingsStore from '../../../stores/settings.store';
import { MicroControllerType } from '../../microcontroller/microcontroller';
import { get } from 'svelte/store';

export const getBoardType = (): MicroControllerType => {
  return get(settingsStore)['boardType'] || MicroControllerType.ARDUINO_UNO;
};
