import * as sapper from '@sapper/app';
import config from "./env";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/storage";

sapper.start({
  target: document.querySelector('#sapper'),
});


  // Initialize Firebase
  firebase.initializeApp(config.firebase);
  firebase.analytics();

  // if (window.location.hostname === "localhost") {
  //   firebase.auth().useEmulator("http://localhost:9099/");
  //   firebase.firestore().settings({
  //     host: "localhost:8080",
  //     ssl: false,
  //   });
  // } else {
    firebase.firestore().settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    });
  // }

  firebase.firestore().enablePersistence({ synchronizeTabs: true });



