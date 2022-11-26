import React from 'react';
import logo from './logo.svg';
import {
    Stage,
    Layer,
    Rect,
    Text,
    Circle,
    Line
} from 'react-konva';

import { useDispatch, useSelector } from 'react-redux';

import {selectUserEmail, setActiveUser, setLogOutState} from '../features/userSlice';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function Login() {

    const dispatch = useDispatch();

  // a selector to access or read the userEmail state
  const userEmail = useSelector(selectUserEmail);


  // fired on button click while the user is not signed in.
  // the userEmail state is set (or "dispatched") after getting it from "credentials".
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

  // sets logOutState (basically userEmail = null) or "dispatches" a null value to the userEmail state.
  const handleSignOut = () => {
    auth.signOut()
    .then(() => {
      dispatch(setLogOutState())
      alert('User signed out')
    })
  }

    return (
        <div
            style={{
            paddingBottom: 50,
            paddingTop: 10,
            textAlign: "center"
        }}>
            <img width={100} height={100}
                src="https://image.shutterstock.com/image-vector/plate-vector-illustrationisolated-on-white-260nw-1815162875.jpg"></img>
            <h1 style={{
                fontWeight: "bolder"
            }}>
                DishZero
            </h1>
            <h3 >
                Helping the planet one dish<br></br>
                at a time
            </h3>
            <Stage width={window.innerWidth} height={200}>
                <Layer>
                    <Rect x={125} y={0} width={150} height={150} fill="#D6D6D6"/>
                </Layer>
            </Stage>
            <br></br>
            <button>Login with Google</button>
        </div>
    );
}
export default Login;
