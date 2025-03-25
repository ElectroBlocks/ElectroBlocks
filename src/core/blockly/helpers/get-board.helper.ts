import settingsStore from '../../../stores/settings.store';
import { MicrocontrollerType } from '../../microcontroller/microcontroller';
import { get } from 'svelte/store';

export const getBoardType = (): MicrocontrollerType => {
  const currentSettings = get(settingsStore);
  if (!currentSettings) {
    return MicrocontrollerType.ARDUINO_UNO;
  }
  return get(settingsStore)["boardType"];
};
