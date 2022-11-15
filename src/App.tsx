import React from 'react';
import './App.css';

import { useDispatch, useSelector } from 'react-redux';

import {selectUserEmail, setActiveUser, setLogOutState} from './features/userSlice';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';


function Login() {

  const dispatch = useDispatch();
  const userEmail = useSelector(selectUserEmail);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
    .then((credentials) => {
      if (!credentials.user.email?.match('@ualberta.ca')) {
        auth.currentUser?.delete();
        alert('Cannot login with a non-ualberta account')
      } else {
        dispatch(setActiveUser({
          userEmail: credentials.user.email
        }))
      }
    })
    .catch((err) => {
      alert(err.message)
    })
  }

  const handleSignOut = () => {
    auth.signOut()
    .then(() => {
      dispatch(setLogOutState())
      alert('User signed out')
    })
  }

  return (
    <div>
      <div>
        {
          userEmail ? (<button onClick={handleSignOut}>Sign Out</button>) : 
          (<button onClick={handleSignIn}>Sign In</button>)
        }
      </div>
    </div>
  );
}

export default Login;
