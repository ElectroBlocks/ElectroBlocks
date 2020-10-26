import * as sapper from '@sapper/app';
import config from "./env";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

console.log("here here");

sapper.start({
  target: document.querySelector('#sapper'),
});

// Initialize Firebase
firebase.initializeApp(config.firebase);
firebase.analytics();

firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
});

firebase.firestore().enablePersistence({ synchronizeTabs: true });
