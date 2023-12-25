/*eslint-disable*/
import { useState, useEffect, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
//import Scanner from "../widgets/scanner"
//import DishAPI from "../features/api"
import "../styles/QRScanner.css";
//import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { AppHeader } from "../widgets/appHeader";
import Scanner from "../widgets/scanner";
import CameraInput from "../widgets/cameraScanner";
import BottomTextInput from "../widgets/bottomTextInput";
import {
  Button,
  Typography,
  Box,
  Avatar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  IconButton,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { BallTriangle } from "react-loader-spinner";
import plateIcon from "../assets/dish_icon_contained.svg";
import mugIcon from "../assets/mug_icon_contained.svg";
import MobileBackground from "../assets/leaf-mobile-background.png";
import ReportIcon from "../assets/megaphone.svg";
import ErrorIcon from "../assets/error_icon.svg";
import CloseIcon from "../assets/X_icon.svg";
import axios from "axios";

const PopUpModal = memo(({ dishType, error, reportToggle, qid, isMobile }) => {
  let avatarIcon;
  if (error) {
    avatarIcon = ErrorIcon;
  } else if (dishType == "plate") {
    avatarIcon = plateIcon;
  } else {
    avatarIcon = mugIcon;
  }
  return (
    <Box
      sx={stylesConst.boxContainer}
      className="position-fixed translate-middle slide-in-popup animate"
    >
      <Avatar
        src={avatarIcon}
        variant="square"
        sx={{ width: 60, height: 60, marginRight: 2.5 }}
        // sx={{ marginRight: 2.5 }}
        alt="Sign In Button Logo"
      />
      <div style={stylesConst.divContainer}>
        {error ? (
          <div>
            <Typography sx={stylesConst.errorText}>Failed to return</Typography>
            <Typography sx={stylesConst.errorText}>{error}</Typography>
          </div>
        ) : (
          <div style={{ flex: 1, flexDirection: "row" }}>
            <Typography sx={stylesConst.successText}>
              Successfully returned
            </Typography>
            {/* <img
              style={{ paddingRight: 16 }}
              src={ReportIcon}
              alt=""
              onClick={reportToggle}
            /> */}
          </div>
        )}
        <Typography variant="h6" sx={stylesConst.text}>
          {dishType.charAt(0).toUpperCase() + dishType.slice(1)} #{qid}
        </Typography>

        {error ? (
          <Typography sx={stylesConst.errorCaption}>
            Please scan and try again
          </Typography>
        ) : (
          <></>
        )}
      </div>
      {error ? (
        <></>
      ) : (
        <div style={{ marginLeft: "auto" }}>
          <Button
            onClick={reportToggle}
            variant="contained"
            color="error"
            sx={{ minWidth: "unset", borderRadius: "100px", aspectRatio: "1" }}
          >
            <Avatar
              src={ReportIcon}
              sx={{ width: 25, height: 25, margin: "0" }}
              variant="square"
            ></Avatar>
          </Button>
        </div>
      )}
    </Box>
  );
});
const Return = () => {
  const [scanId, setScanId] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [dishType, setDishType] = useState("");
  const [qid, setQid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dishIcon, setDishIcon] = useState();
  const [notifType, setNotifType] = useState("returned");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [reportPopUp, setReportPopUp] = useState(false);
  const [reportValue, setReportValue] = useState("small_crack_chip");
  const [dishID, setDishID] = useState("");
  const { currentUser, sessionToken } = useAuth();

  const navigate = useNavigate();
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (popUp) {
        setPopUp(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [popUp]);

  const onCancel = popUp
    ? () => {
        setPopUp(false);
      }
    : null;

  const onClick = () => {
    setPopUp(true);
  };

  const ReportModal = () => {
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setReportValue((event.target as HTMLInputElement).value);
    };
    return (
      <div
        className="position-absolute top-50 start-50 translate-middle shadow-lg"
        style={{
          ...stylesConst.boxContainer,
          zIndex: 10000,
          height: 500,
          maxWidth: "300px",
          flexDirection: "column",
          borderColor: "black",
          color: "white",
          justifyContent: "space-evenly",
        }}
      >
        <IconButton
          aria-label="delete"
          onClick={() => setReportPopUp(!reportPopUp)}
          sx={{ position: "absolute", padding: "15px", right: 20, top: 20 }}
        >
          <Avatar
            src={CloseIcon}
            sx={{ width: 25, height: 25 }}
            variant="square"
          ></Avatar>
        </IconButton>
        <Typography sx={{ color: "black", fontSize: 30 }}>Report</Typography>
        <Avatar
          src={dishType == "plate" ? plateIcon : mugIcon}
          sx={{ width: 75, height: 75 }}
          variant="square"
        ></Avatar>
        <FormControl>
          <RadioGroup
            aria-labelledby="yes"
            name="radio-buttons-group"
            onChange={handleRadioChange}
            value={reportValue}
          >
            <FormControlLabel
              value="small_crack_chip"
              control={
                <Radio
                  onClick={() => {
                    // setReportValue("small_crack_chip");
                  }}
                />
              }
              sx={{ color: "black" }}
              label="Small crack/chip"
            />
            <FormControlLabel
              value="large_crack_chunk"
              control={
                <Radio
                  onClick={() => {
                    // setReportValue("large_crack_chunk");
                  }}
                />
              }
              sx={{ color: "black" }}
              label="Large crack/chunk missing"
            />
            <FormControlLabel
              value="shattered"
              control={
                <Radio
                  onClick={() => {
                    // setReportValue("shattered");
                  }}
                />
              }
              sx={{ color: "black" }}
              label="Shattered"
            />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          onClick={reportToggle}
          size="large"
          sx={{
            color: "white",
            backgroundColor: "#BF4949",
            width: "150px",
            borderRadius: "100px",
          }}
        >
          Report
        </Button>
      </div>
    );
  };
  const onSubmit = async (condition: string) => {

    console.log("Session-token: ", sessionToken);
    let dishID;

    console.log("API-KEY: ", process.env.REACT_APP_API_KEY);

    setDishType("");
    if (!/^\d+$/.test(condition)) {
      const matches = condition.match(/[0-9]+$/);
      if (matches) {
        condition = String(parseInt(matches[0], 10));
      }
    }

    console.log("Condition: ", condition);

    setQid(condition);
    setIsLoading(true);

    await axios
      .get(`/api/dish`, {
        headers: {
          "x-api-key": `${process.env.REACT_APP_API_KEY}`,
          "session-token": sessionToken,
        },
        baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
        params: { qid: condition },
      })
      .then(function (response) {
        console.log(response);
        setDishType(response.data.dish.type);
        setDishID(response.data.dish.id);
      })
      .catch(function (error) {
        console.log(error);
      });

    //let icon = eval(dishType + "Icon") Trying to create a dynamic variable which does work but does not properly reference the imported image variable.
    //How are we gonna handle other dish types?
    //setDishIcon(icon);

    await axios
      .post(
        `/api/dish/return`,
        {
          returned: {
            condition: "alright",
          },
        },
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-token": sessionToken,
            "Content-Type": "application/json",
          },
          params: { qid: condition },
          baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
        }
      )
      .then(function (response) {
        setError("");
        setIsLoading(false);
        setPopUp(true);
      })
      .catch(function (error) {
        // handle error
        console.log(error.response.data.message);
        setError(error.response.data.message);
        setIsLoading(false);
        setPopUp(true);
      });
  };

  const reportToggle = () => {
    console.log(dishID);
    console.log(reportValue);

    if (reportPopUp) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/condition?id=${dishID}`,
          {
            condition: `${reportValue}`,
          },
          {
            headers: {
              "x-api-key": `${process.env.REACT_APP_API_KEY}`,
              "session-token": sessionToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error.response.data.message);
          setError(error.response.data.message);
        });
    }

    setReportPopUp(!reportPopUp);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#464646",
      }}
    >
      {/* {isLoading ? ( */}
      {/* <></> */}
      {/* // ) : ( */}
      <AppHeader title={"Return Dishes"} className={"headerDiv"} />
      {/* // )} */}
      {/* {isLoading ? (
        <Box
          sx={isMobile ? stylesConst.rootMobileLoader : stylesConst.rootDesktop}
        >
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            visible={true}
          />
        </Box>
      ) : (
        <></>
      )} */}
      {reportPopUp ? (
        <>
          <ReportModal />
        </>
      ) : (
        <></>
      )}
      {popUp ? (
        <>
          <PopUpModal
            dishType={dishType}
            error={error}
            reportToggle={reportToggle}
            qid={qid}
            isMobile={isMobile}
          />
        </>
      ) : (
        <></>
      )}
      <CameraInput
        setLoading={setIsLoading}
        isMobile={isMobile}
        isLoading={isLoading}
        style={{ height: "100%" }}
        onSubmit={onSubmit}
      />
      <BottomTextInput disabled={isLoading} value = {scanId} onChange = {(e) => setScanId(e.target.value)} onSubmit={ onSubmit}  />
    </div>
  );
};

export default Return;

const stylesConst = {
  boxContainer: {
    width: "90%",
    maxWidth: "350px",
    height: "5%",
    display: "flex",
    position: "fixed",
    bottom: "100px",
    left: "20%",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "white",
    flexDirection: "row",
    paddingLeft: 3,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 3,
    justifyContent: "start",
    zIndex: 999,
  },

  divContainer: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif !important',
    flexDirection: "column",
  },

  errorText: {
    fontSize: "10px",
    fontFamily: "Poppins, sans-serif",
    color: "red",
  },
  errorCaption: {
    fontSize: "13px",

    color: "#757575",
  },
  successText: {
    fontSize: "10px",
    fontFamily: "Poppins, sans-serif",
    color: "green",
  },

  text: {
    fontSize: "15px",
    fontFamily: "Poppins, sans-serif",
    color: "#4c4242",
  },

  rootDesktop: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  rootMobileLoader: {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    zIndex: 1000,
  },
} as const;
