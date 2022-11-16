import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import DishCheckout from "./widgets/checkout/DishCheckout";
import {getFirestore} from "firebase/firestore";
import routes from "./routes";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0CRtoe1eoBS5hwAAJWyS8Us5C1K501mY",
  authDomain: "dishzero-serviet.firebaseapp.com",
  projectId: "dishzero-serviet",
  storageBucket: "dishzero-serviet.appspot.com",
  messagingSenderId: "273096823928",
  appId: "1:273096823928:web:3ae7f21ca35890cc86098d",
  measurementId: "G-YH3SYRJJ6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const router = createBrowserRouter(routes);

function App() {
  return (
    <RouterProvider router={router} />
    // <div className="App">
    //   <DishCheckout db={db}/>
    // </div>
  );
}

export default App;
