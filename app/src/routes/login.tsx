import React, { useContext, useEffect, useState } from "react";
import "../styles/login.css";
import desktopLogo from "../assets/dishzero-logo-desktop.png";
import mobileLogo from "../assets/dishzero-logo-mobile.png";
import signInButtonLogo from "../assets/sign-in-button-logo.png";

import { GoogleAuth, FirebaseAuth, FirebaseContext } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import DishAPI from "../features/api";

const useQuery = () => new URLSearchParams(useLocation().search);

function Login() {
  const fbContext = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // const {transaction_id} = useParams();
  const query = useQuery();
  const transaction_id = query.get("transaction_id");
  useEffect(() => {
      if (fbContext?.user) {
          console.log(transaction_id)
          if(transaction_id){
              DishAPI.updateDocWithUserID(transaction_id, fbContext?.user?.uid);  
              //send a firebase request to add the user to the document with the handle
              
          }
          navigate("/home");
      }
  }, [fbContext?.user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (fbContext?.user) {
    return <div />;
  }

  // fired on button click while the user is not signed in.
  // the userEmail state is set (or "dispatched") after getting it from "credentials".
  const handleSignIn = () => {
    signInWithPopup(FirebaseAuth, GoogleAuth)
      .then((credentials) => {
        if (!credentials.user.email?.match("@ualberta.ca")) {
          credentials.user?.delete();
          alert("Please login with your University of Alberta CCID");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className={ 
      isMobile ? 
        "root-mobile" 
        : "root-desktop"
    }>
      <img src={ 
        isMobile ? 
          mobileLogo 
          : desktopLogo 
      } className={ 
        isMobile ? 
          "logo-mobile" 
        : "logo-desktop" 
      } />
      <div className={ 
        isMobile ? 
          "right-frame-mobile" 
          : "right-frame-desktop" 
      }>
        <p className="dish-zero-heading">DishZero</p>
        <p className="subheading">Helping the planet one dish at a time</p>
        <button className={ 
          isMobile ? 
            "sign-in-button-mobile" 
            : "sign-in-button-desktop" 
          } 
          onClick={handleSignIn}
        >
          <img src={signInButtonLogo} className="signInButtonLogo"/>
          <p className="signInButtonText">Sign in with CCID</p>
        </button>
      </div>
    </div>
  );
}
export default Login;
