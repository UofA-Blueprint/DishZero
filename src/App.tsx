import React from 'react';
import './App.css';


import { useDispatch, useSelector } from 'react-redux';

import {selectUserEmail, setActiveUser} from './features/userSlice';
import { authenticate } from './Auth';
import { auth } from './firebase';


function App() {

  const dispatch = useDispatch();
  const userEmail = useSelector(selectUserEmail);

  const handleSignIn = () => {
    const status = authenticate();
    if (status !== false){
      dispatch(setActiveUser({
        userEmail: status.user.email
      }))
    } else {
      alert('Error logging you in.')
    }
  }

  const handleSignOut = () => {
    console.log(userEmail)
    auth.signOut()
    .then(() => {
      alert('User signed out')
    })
  }

  return (
    <div className="App">
      <div>
        {
          userEmail ? (<button onClick={handleSignOut}>Sign Out</button>) : 
          (<button onClick={handleSignIn}>Sign In</button>)
        }
      </div>
    </div>
  );
}

export default App;
