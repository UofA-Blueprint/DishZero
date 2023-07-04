import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, Box, Avatar } from '@mui/material';
import desktopLogo from "../assets/dishzero-logo-desktop.png";
import mobileLogo from "../assets/dishzero-logo-mobile.png";
import signInButtonLogo from "../assets/sign-in-button-logo.png";
import MobileBackground from '../assets/leaf-mobile-background.png';

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
    <Box sx={isMobile ? styles.rootMobile : styles.rootDesktop}>
      <Box
        sx={isMobile ? styles.logoMobile : styles.logoDesktop}
      />
      <Box sx={isMobile ? styles.rightFrameMobile : styles.rightFrameDesktop}>
        <Typography variant="h1" sx={styles.dishZeroHeading}>
          DishZero
        </Typography>
        <Typography variant="subtitle1" sx={styles.subheading}>
          Helping the planet one dish at a time
        </Typography>
        <Button
          variant="contained"
          sx={isMobile ? styles.signInButtonMobile : styles.signInButtonDesktop}
          onClick={handleSignIn}
        >
          <Avatar
            src={signInButtonLogo}
            sx={styles.signInButtonLogo}
            alt="Sign In Button Logo"
          />
          <Typography sx={styles.signInButtonText}>
            Sign in with CCID
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
export default Login;

const styles = {
  rootDesktop: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  rootMobile: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: `url(${MobileBackground})`,
    backgroundSize: 'cover'
  },

  logoMobile: {
    width: '42vw',
    height: '34vw',
    marginTop: '130px',
    marginBottom: '15px',
    backgroundImage: `url(${mobileLogo})`,
    backgroundSize: 'cover'
  },

  logoDesktop: {
    width: '28vw',
    height: '28vw',
    borderRadius: '10px',
    marginRight: '50px',
    backgroundImage: `url(${desktopLogo})`,
    backgroundSize: 'cover'
  },

  rightFrameMobile: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '15px',
    alignItems: 'center',
  },

  rightFrameDesktop: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '50px',
  },

  dishZeroHeading: {
    fontSize: '2.215rem',
    fontWeight: 'bold',
    color: '#4c4242',
  },

  subheading: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#4c4242',
    marginTop: '15px',
  },

  signInButtonMobile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '50px',
    borderRadius: '20px',
    backgroundColor: '#68B49A',
    borderWidth: '0',
    marginTop: '80px',
    '&:hover': {
      backgroundColor: '#68B49A',
    },
  },

  signInButtonDesktop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '50px',
    borderRadius: '20px',
    backgroundColor: '#68B49A',
    borderWidth: '0',
    marginTop: '30px',
    '&:hover': {
      backgroundColor: '#68B49A',
    },
  },

  signInButtonLogo: {
    width: '30px',
    height: '40px',
    marginRight: '7px',
  },

  signInButtonText: {
    fontSize: '1.125rem',
    color: 'white',
    marginLeft: '7px',
  },
};