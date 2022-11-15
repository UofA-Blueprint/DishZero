import React from 'react';
import './App.css';


import { useDispatch, useSelector } from 'react-redux';

import {selectUserEmail, setActiveUser} from './features/userSlice';
import { authenticate } from './Auth';
import { auth } from './firebase';


function App() {

  // TO-DO wrap <App /> with <Provider /> to make it access useDispatch as <App /> is currently a parent.
  // This component will throw an error and nothing will be rendered unless the above is accmomplished.
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
    auth.signOut()
    .then(() => {
      alert('User signed out')
    })
  }

  return (
    <div className="App">
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
        <button onClick={handleSignIn}>Sign In</button>
      </div>
    </div>
  );
}

export default App;
