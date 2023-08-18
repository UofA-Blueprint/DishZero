import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, Box, Avatar } from '@mui/material';
import {BallTriangle} from 'react-loader-spinner';
import desktopLogo from "../assets/dishzero-logo-desktop.png";
import mobileLogo from "../assets/dishzero-logo-mobile.png";
import signInButtonLogo from "../assets/sign-in-button-logo.png";
import MobileBackground from '../assets/leaf-mobile-background.png';
import 'typeface-poppins';
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getIdToken, onAuthStateChanged, signInWithPopup, getAuth } from "firebase/auth";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";


const useQuery = () => new URLSearchParams(useLocation().search);

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  //Show spinner as soon as page is refreshed 
  const [isLoading, setIsLoading] = useState(true);
  const {currentUser} = useAuth()
  
  //const {transaction_id} = useParams();
  const query = useQuery();
  const transaction_id = query.get("transaction_id");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  

  // fired on button click while the user is not signed in.
  // logs in the user and navigates to home screen if successfully logged in
  const handleSignIn = async () => {
    await login()
  }

  //Hide spinner as soon as Auth state has changed i.e. auth state has been read
  useEffect(() => {
    setIsLoading(false)
  }, [currentUser]);

  //As auth state is being read, display loader spinner
  if (isLoading){
    return(
      <Box sx={isMobile ? styles.rootMobileLoader : styles.rootDesktop}>
      <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#4fa94d"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
      </Box>
    )
  }
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
    </Box>)
  
}

const styles = {
  rootDesktop: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  rootMobileLoader:{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${MobileBackground})`,
    backgroundSize: 'cover'

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
    fontSize: '3.5rem',
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif',
    color: '#4c4242',
  },

  subheading: {
    fontSize: '1.25rem',
    fontFamily: 'Poppins, sans-serif',
    color: '#4c4242',
    marginTop: '7px',
  },

  signInButtonMobile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '250px',
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
    width: '250px',
    height: '50px',
    borderRadius: '20px',
    backgroundColor: '#68B49A',
    borderWidth: '0',
    marginTop: '50px',
    '&:hover': {
      backgroundColor: '#68B49A',
    },
  },

  signInButtonLogo: {
    width: '25px',
    height: '30px',
    marginRight: '7px',
  },

  signInButtonText: {
    fontSize: '1.025rem',
    fontFamily: 'Poppins, sans-serif',
    color: 'white',
    marginLeft: '7px',
  },
};