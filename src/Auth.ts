import {auth, provider} from './firebase';
import { signInWithPopup } from 'firebase/auth';

export function authenticate(): any {
  provider.setCustomParameters({ 'hd': 'ualberta.ca' }); // This not restrict domain, only "optimized for accounts at that domain"

  signInWithPopup(auth, provider)
    .then((userCredential) => {

      if (!userCredential.user.email?.match('@ualberta.ca')) {
        auth.currentUser?.delete();
        return false;
      } else {
        // logging for testing
        console.log(userCredential)
        return userCredential;
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      console.error(errorCode, errorMessage, 'email:', email);
    });
}
