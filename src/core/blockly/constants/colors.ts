import { get, writable } from 'svelte/store';
import settingsStore from '../../../stores/settings.store';
import { defaultSetting } from '../../../firebase/model';
import type { Settings } from '../../../firebase/model';

export enum COLOR_THEME_C {
  SENSOR = '#505bda',
  ARDUINO_START_BLOCK = '#b063c5',
  COMPONENTS = '#512c62',
  ARDUINO = '#b063c5',
  DATA = '#ffaac3',
  VALUES = '#505bda',
  CONTROL = '#b063c5',
}

export enum COLOR_THEME_PYTHON {
  SENSOR = '#610C9F',              
  ARDUINO_START_BLOCK = '#940B92', 
  COMPONENTS = '#DA0C81',          
  ARDUINO = '#E95793',           
  DATA = '#7E2185',             
  VALUES = '#A1126F',         
  CONTROL = '#C41E75',            
}

export const colorThemeStore = writable<typeof COLOR_THEME_C | typeof COLOR_THEME_PYTHON>(COLOR_THEME_C);

let COLOR_THEME: typeof COLOR_THEME_C | typeof COLOR_THEME_PYTHON =
  defaultSetting.language === 'Python' ? COLOR_THEME_PYTHON : COLOR_THEME_C;

function updateTheme(settings: Settings) {
  if (settings.language === 'Python') {
    COLOR_THEME = COLOR_THEME_PYTHON;
  } else {
    COLOR_THEME = COLOR_THEME_C;
  }
  colorThemeStore.set(COLOR_THEME);
}

updateTheme(get(settingsStore));

settingsStore.subscribe((newSettings) => {
  updateTheme(newSettings);
});

export { COLOR_THEME };
