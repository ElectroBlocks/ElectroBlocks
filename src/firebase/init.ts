import userStore from "../stores/auth.store";
 

export function initFirebase(sessionConfig) {

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: sessionConfig.apiKey,
      authDomain: sessionConfig.authDomain,
      databaseURL: sessionConfig.databaseURL,
      projectId: sessionConfig.projectId,
      storageBucket: sessionConfig.storageBucket,
      messagingSenderId: sessionConfig.messagingSenderId,
      appId: sessionConfig.appId,
      measurementId: sessionConfig.measurementId,
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

  firebase.firestore().enablePersistence({ synchronizeTabs: true });

}

