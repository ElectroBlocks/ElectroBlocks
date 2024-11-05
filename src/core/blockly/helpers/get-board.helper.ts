import settingsStore from '../../../stores/settings.store';
import { MicroControllerType } from '../../microcontroller/microcontroller';
import { get } from 'svelte/store';

export const getBoardType = (): MicroControllerType => {
  const currentSettings = get(settingsStore);
  if (!currentSettings) {
    return MicroControllerType.ARDUINO_UNO;
  }
  return get(settingsStore)["boardType"];
};
