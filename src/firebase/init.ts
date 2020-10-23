import is_browser from "../helpers/is_browser";
import userStore from "../stores/auth.store";

if (is_browser()) {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBwZ_RJDOuWRQLAzgEh7wiL8FwBvnsnoUA",
    authDomain: "electroblocks-test.firebaseapp.com",
    databaseURL: "https://electroblocks-test.firebaseio.com",
    projectId: "electroblocks-test",
    storageBucket: "electroblocks-test.appspot.com",
    messagingSenderId: "370076465752",
    appId: "1:370076465752:web:a290cbfc392e53e148682d",
    measurementId: "G-1LN06YQD0G",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userStore.set({ isLoggedIn: true, uid: user.uid  });
      return;
    }
    userStore.set({ isLoggedIn: false, uid: null  });
  });
    
    firebase.firestore().settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });

    firebase.firestore().enablePersistence()

    
    
}