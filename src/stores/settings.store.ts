import { writable } from 'svelte/store';
import { Settings } from '../firebase/model';
import is_browser from '../helpers/is_browser';
import { defaultSetting } from '../firebase/model';
import _ from 'lodash';
import authStore from './auth.store';
import firebase from "firebase/app";
let settings;
try {
    settings =
      is_browser() && localStorage.getItem("settings")
        ? JSON.parse(localStorage.getItem("settings"))
        : defaultSetting;
} catch (e) {
  settings = defaultSetting;
}


const settingsStore = writable<Settings>(settings);


authStore.subscribe(async auth => {
  if (auth.isLoggedIn && is_browser()) {
    try {
      const db = firebase.firestore();
      const settings = await db.collection("settings").doc(auth.uid).get();
      if (settings.exists) {
        settingsStore.set(settings.data() as Settings);
      }
    } catch (e) {
      console.log(e, 'error settings');
    }
  }
});

settingsStore.subscribe(newSettings => {
  if (is_browser()) {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  }
})

export default {
  subscribe: settingsStore.subscribe,
  set: settingsStore.set
};
