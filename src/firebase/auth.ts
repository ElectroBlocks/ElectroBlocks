export const loginGoogleUser = async () => {
  await firebase.auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

export const logout = async () => {
  await firebase.auth().signOut();
};
