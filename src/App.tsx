import React from 'react';
import logo from './logo.svg';
import './App.css';


import {auth, provider} from './firebase';
import { signInWithPopup } from 'firebase/auth';

import { useDispatch, useSelector } from 'react-redux';

import {selectUserEmail, setActiveUser} from './features/userSlice';




function App() {

  // TO-DO wrap <App /> with <Provider /> to make it access useDispatch as <App /> is currently a parent.
  // This component will throw an error and nothing will be rendered unless the above is accmomplished.
  const dispatch = useDispatch();
  const userEmail = useSelector(selectUserEmail);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
    .then((credentials) => {

      if (!auth.currentUser?.email?.match('@ualberta.ca')){
        auth.currentUser?.delete()
        alert('User not valid. Please use your UAlberta email to login.')
      } else {
        dispatch(setActiveUser({
          email: credentials.user.email
        }))
      }      
    })
    .catch(err => {
      alert(err)
    })

  }



  const handleSignOut = () => {

    // TO-DO Create the signout function

    return
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>

        {
          userEmail ? 
          (<button onClick={handleSignOut}>Sign Out</button>) : 
        
          (<button onClick={handleSignIn}>Sign In</button>)
        }

      </div>
    </div>
  );
}

export default App;
