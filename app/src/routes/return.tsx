import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import React from 'react';
//import Scanner from "../widgets/scanner"
//import DishAPI from "../features/api"
import '../styles/QRScanner.css';
import axios from "axios";
//import { Button, Modal } from 'react-bootstrap'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie';
import { AppHeader } from "../widgets/appHeader";
import Scanner from "../widgets/scanner";
import CameraInput from "../widgets/cameraScanner";
import BottomTextInput from "../widgets/bottomTextInput";
import { Button, Typography, Box, Avatar } from '@mui/material';
import { useAuth } from "../contexts/AuthContext";
import {BallTriangle} from 'react-loader-spinner';
import plateIcon from "../assets/dish_icon_contained.svg";
import mugIcon from "../assets/mug_icon_contained.svg";
import MobileBackground from '../assets/leaf-mobile-background.png';
/*const Report = ({ show, onSubmit, onCancel, id }) => {
    const conditions = ["Small Chip/Crack", "Large chunk", "Shattered"]
    const [selectedCondition, setSelectedCondition] = useState("");
    const onConditionChange = e => {
        setSelectedCondition(e.target.value);
    }

  const submitCondition = () => {
    setSelectedCondition("");
    onSubmit(selectedCondition);
  };

  const closeReport = () => {
    setSelectedCondition("");
    onCancel();
  };

  return show ? (
    <Modal
      backdrop={false}
      onHide={closeReport}
      show={show}
      className="modal-sm report-modal"
      contentClassName="report-modal-height"
      centered
    >
      <Modal.Header closeButton className="report-modal-header">
        <div className="report-modal-title">Report</div>
      </Modal.Header>
      <Modal.Body className="report-modal-body text-center">
        <div className="large-graphic" />
        <div style={{ marginTop: "5px" }}>ID: {id}</div>
        <div style={{ marginTop: "20px", display: "block" }}>
          <div className="text-left">
            <input
              type="radio"
              onChange={onConditionChange}
              value={conditions[0]}
              name="condition"
            />{" "}
            {conditions[0]} <br />
          </div>
          <div>
            <input
              type="radio"
              onChange={onConditionChange}
              value={conditions[1]}
              name="condition"
            />{" "}
            {conditions[1]} <br />
          </div>
          <div>
            <input
              type="radio"
              onChange={onConditionChange}
              value={conditions[2]}
              name="condition"
            />{" "}
            {conditions[2]}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="report-modal-footer justify-content-center">
        <Button
          disabled={selectedCondition === "" ? true : false}
          variant="secondary"
          onClick={submitCondition}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

const Notification = ({ show, type, onClick, id }) => {
  return show ? (
    <div className="position-absolute bottom-0 notif">
      <div className="graphic" />
      <div className="text-group">
        <div style={{ fontSize: "14px", fontWeight: 400 }}>
          Successfully {type}
        </div>
    ) : null;
}
*/
/*export delt () => {
    const [scanId, setScanId] = useState("")
    const [showNotif, setShowNotif] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [notifType, setNotifType] = useState("returned");

  const { sessionToken } = useAuth();
  const navigate = useNavigate();

  const onScan = async (id: string) => {
    setScanId(id);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/return?qid=${id}`,
        {
          returned: {
            broken: false,
            lost: false,
          },
        },
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-cookie": sessionToken,
          },
        }
      );

      if (response && response.status === 200) {
        if (showNotif) setShowNotif(false);
        setNotifType("returned");
        setShowNotif(true);
      } else {
        console.log("failed to return dish, response not okay");
        console.log(response);
      }
    } catch (error: any) {
      console.log("failed to return dish");
      console.log(error);
    }
  };

  const onCancel = popUp
    ? () => {
        setPopUp(false);
      }
    : null;

  const onClick = () => {
    setPopUp(true);
  };

  const onSubmit = async (condition: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/condition?qid=${scanId}`,
        { condition },
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-token": sessionToken,
          },
        }
      );
      if (response && response.status === 200 && response.statusText === "OK") {
        setPopUp(false);
        if (showNotif) {
          setShowNotif(false);
        }
        setNotifType("reported");
        setShowNotif(true);
      } else {
        console.log("failed to update dish condition, response not okay");
        console.log(response);
      }
    } catch (error: any) {
      console.log("failed to update dish conditon");
      console.log(error);
    }
  };

    return (
        <>
            <Scanner
                mode="Scan Dishes"
                onScan={onScan}
                onClose={() => navigate("/home")}
            />
            <Notification
                show={showNotif}
                type={notifType}
                onClick={onClick}
                id={scanId}
            />
            <Report
                show={popUp}
                onSubmit={onSubmit}
                onCancel={onCancel}
                id={scanId}
            />
        </>
    )
}*/
const Return = () => {
    const [scanId, setScanId] = useState("")
    const [showNotif, setShowNotif] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [dishType, setDishType] = useState('');
    const [qid, setQid] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dishIcon, setDishIcon] = useState();
    const [notifType, setNotifType] = useState("returned");
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { currentUser, sessionToken } = useAuth();

    const navigate = useNavigate()
    const location = useLocation();

    /*const onScan = async (id: string) => {
        setScanId(id);
        let val = await DishAPI.updateDishReturn(id);
        // if an animation is added, this will re-trigger it
        if (!(val === null)) {
            if (showNotif)
                setShowNotif(false);
            setNotifType("returned");
            setShowNotif(true);
        }
    }*/

    useEffect(()=>{
      const timer = setTimeout( () => {
        if(popUp){
          setPopUp(false)
        }
      }, 3000)
      return () => clearTimeout(timer);
    }, [popUp])

    const onCancel = popUp ? () => {
        setPopUp(false)
    } : null

    const onClick = () => {
        setPopUp(true);
    }

    const onSubmit = async (condition: string) => {
        console.log("peewoop") //Remove this
        
        console.log("Session-token: ", sessionToken);
        let dishID;

        console.log("API-KEY: ", process.env.REACT_APP_API_KEY);

        setDishType('');
        if (!(/^\d+$/.test(condition))){
          const matches = condition.match(/[0-9]+$/);
          if (matches){
            condition = String(parseInt(matches[0], 10));
          }
        }

        console.log("Condition: ", condition);

        setQid(condition);
        setIsLoading(true);

       await axios
      .get(`${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish`, {
        headers: { "x-api-key": `${process.env.REACT_APP_API_KEY}`, "session-token": sessionToken },
        params: {qid: condition}
      })
      .then(function (response) {
        console.log(response)
        setDishType(response.data.dish.type)
      })
      .catch(function (error) {
        console.log(error);
      });

      //let icon = eval(dishType + "Icon") Trying to create a dynamic variable which does work but does not properly reference the imported image variable. 
      //How are we gonna handle other dish types?
      //setDishIcon(icon); 
          

        

        

        await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/return`, {
           
            "returned": {
              "condition": "alright",
            }
         
        },
        {headers:{"x-api-key":`${process.env.REACT_APP_API_KEY}`,"session-token":sessionToken, 'Content-Type': 'application/json'},
         params: {qid: condition},
           })
        .then(function (response) {

          setError('');
          setIsLoading(false);
          setPopUp(true)

        })
        .catch(function (error) {
            // handle error
            console.log(error.response.data.message);
            setError(error.response.data.message);
            setIsLoading(false);
            setPopUp(true);
            
        })        
    }

    
    return(
        
          
            <div style={{height: '100%', width: '100%', flex: 1}}>
              {(isLoading) ? <></> : <AppHeader title = {'Return Dishes'} className = {"headerDiv"} /> }
              {(isLoading) ?
              
                <Box sx={isMobile ? stylesConst.rootMobileLoader : stylesConst.rootDesktop}>
                  <BallTriangle
                      height={100}
                      width={100}
                      radius={5}
                      color="#4fa94d"
                      ariaLabel="ball-triangle-loading"
                      visible={true}
                    />
                </Box> : <></>}
              {(popUp) ? 
                <Box sx={stylesConst.boxContainer}>
                  
                    <Avatar
                      src={dishType === 'plate' ? plateIcon : mugIcon}
                      sx={{marginRight: 2.5}}
                      alt="Sign In Button Logo"
                    />
                    <div style={stylesConst.divContainer}>
                      {
                        (error) ? 
                        <div>
                          <Typography sx={stylesConst.errorText}>
                            {error} 
                          </Typography >
                          <Typography sx={stylesConst.errorText}>
                            Failed to return
                          </Typography >
                        </div> :
                          <Typography sx={stylesConst.successText}>
                            Successfully returned
                          </Typography >
                      }
                      <Typography variant="h6" sx={stylesConst.text}>
                        {dishType.charAt(0).toUpperCase() + dishType.slice(1)} #{qid}
                      </Typography>
                    </div>
                </Box>:<></> }
              <CameraInput setLoading={setIsLoading} style = {{height: '100%'}} onSubmit={onSubmit}/>
              <BottomTextInput disabled = {isLoading} onSubmit = {onSubmit}/>
            </div>
          
    )
}

export default Return

const stylesConst = {
  boxContainer: {
    width: "60%",
    height: "5%",
    display: 'flex',
    position: 'fixed',
    bottom: '100px',
    left: '20%',
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'white',
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-evenly",
    zIndex: 999
  },

  divContainer: {
    
    flexDirection: 'column'
   
  },

  errorText:{
    fontSize: '10px',
    fontFamily: 'Poppins, sans-serif',
    color: 'red',
  },

  successText: {
    fontSize: '10px',
    fontFamily: 'Poppins, sans-serif',
    color: 'green',
  },

  text: {
    fontSize: '15px',
    fontFamily: 'Poppins, sans-serif',
    color: '#4c4242',
  },

  rootDesktop: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50
  },
  rootMobileLoader:{
    width: '100%',
    height: '100%',
    position: 'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1000
  },

} as const;
