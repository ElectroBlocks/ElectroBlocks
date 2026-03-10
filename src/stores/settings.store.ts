import { writable } from "svelte/store";
import type { Settings } from "../firebase/model";
import is_browser from "../helpers/is_browser";
import { defaultSetting } from "../firebase/model";
import _ from "lodash";
import authStore from "./auth.store";
import { MicroControllerType, SUPPORTED_LANGUAGES } from "../core/microcontroller/microcontroller";
import { getSettings } from "../firebase/db";
let settings;
try {
  settings =
    is_browser() && localStorage.getItem("settings")
      ? JSON.parse(localStorage.getItem("settings"))
      : defaultSetting;

  if (!settings.language) {
    settings.language = SUPPORTED_LANGUAGES.C;
  }

} catch (e) {
  settings = defaultSetting;
}

settings["boardType"] = settings.boardType || MicroControllerType.ARDUINO_UNO;
settings["language"] = settings.language || SUPPORTED_LANGUAGES.C;

const settingsStore = writable<Settings>(settings);

authStore.subscribe(async (auth) => {
  if (auth.isLoggedIn && is_browser()) {
    try {
      const settingsFB = await getSettings(auth.uid);
      if (!settingsFB.language) {
        settingsFB.language = SUPPORTED_LANGUAGES.C;
      }
      settingsStore.set(settingsFB);
    } catch (e) {
      console.log(e, "error settings");
    }
  }
});

settingsStore.subscribe((newSettings) => {
  if (is_browser()) {
    if (!newSettings.language) {
      newSettings.language = SUPPORTED_LANGUAGES.C;
    }
    localStorage.setItem("settings", JSON.stringify(newSettings));
  }
});

export default {
  subscribe: settingsStore.subscribe,
  set: settingsStore.set,
  update: settingsStore.update,
};
