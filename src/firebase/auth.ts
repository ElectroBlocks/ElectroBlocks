import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

export const loginGoogleUser = async () => {
  const auth = getAuth();

  signInWithPopup(auth, new GoogleAuthProvider());
};

export const logout = async () => {
  const auth = getAuth();

  await signOut(auth);
};
