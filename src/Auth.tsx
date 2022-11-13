// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


// import { useDispatch, useSelector } from 'react-redux';
// import { setActiveUser, selectUserEmail, setLogOutState,  } from './features/userSlice';


// export function authenticate(): boolean {
//   const provider = new GoogleAuthProvider()
//   provider.setCustomParameters({ 'hd': 'ualberta.ca' }); // This not restrict domain, only "optimized for accounts at that domain"
  
//   const dispatch = useDispatch();

//   const userEmail = useSelector(selectUserEmail);


//   signInWithPopup(auth, provider)
//     .then((userCredential) => {

//       // TODO: Update Redux Stores, What else needs to be done here?

//       // Should still check resulting email
//       if (!userCredential.user.email?.match('@ualberta.ca')) {
//         auth.currentUser?.delete();
//         return false;
//       } else {
//         dispatch(setActiveUser({
//           email: userCredential.user.email
//         }))
//         return true;
//       }
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       const email = error.customData.email;
//       console.error(errorCode, errorMessage, 'email:', email);
//     });

//   return false;
// }
