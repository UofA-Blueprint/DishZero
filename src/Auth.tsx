import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

import { auth } from './App';

export function authenticate(): boolean {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ 'hd': 'ualberta.ca' }); // This not restrict domain, only "optimized for accounts at that domain"

  signInWithPopup(auth, provider)
    .then((userCredential) => {

      // TODO: What else needs to be done here?

      // Should still check resulting email
      if (!userCredential.user.email?.match('@ualberta.ca')) {
        auth.currentUser?.delete();
        return false;
      }

      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(errorCode, errorMessage, 'email:', email, 'credential:', credential);
    });

  return false;
}
