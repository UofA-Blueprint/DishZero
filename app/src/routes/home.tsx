import React, { useState, useEffect } from "react";
import { Link as ReactRouterLink} from "react-router-dom";
import { faAngleDoubleLeft, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import scan_icon from "../assets/scan.svg";
import leaf_white from "../assets/leaf-white.svg";
import leaf_green from "../assets/leaf-green.svg";
import external_link from "../assets/external_link.svg";
import DishCard from "../widgets/dishcard";
import "../styles/index.css";
import axios from "axios";
import { Box, AppBar, Typography, Link as LinkMUI } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { config } from "../config";

const DishLog = ({ dishes }) => {
  const { sessionToken } = useAuth();
  return (
    <div id="dish-log" className="mt-3">
      {dishes.map((dish) => {
        if (dish.returned.timestamp === null) {
          return <DishCard dish={dish} token={sessionToken} key={dish.id} />;
        }
      })}
    </div>
  );
};

const NewUser = (dishesUsed) => {
  const content = GetDishes(dishesUsed);
  return (
    <div style={{ padding: "24px" }}>
      <div className="sub-header-3">
        How It Works
        <div
          className="light-blue d-flex flex-column justify-content-end"
          style={{
            height: "80px",
            width: "88%",
            borderRadius: "10px",
            marginTop: "16px",
            position: "relative",
          }}
        >
          <p
            className="details-1"
            style={{
              height: "60px",
              width: "198px",
              marginTop: "-32px",
              marginBottom: "16px",
              marginLeft: "24px",
              marginRight: "40px",
            }}
          >
            {" "}
            More details about the process behind borrowing and returning
            dishes.
          </p>
          <LinkMUI href="https://www.dishzero.ca/how-it-works-1">
            <img
              src={external_link}
              alt="External Link"
              style={{
                position: "absolute",
                top: "19px",
                bottom: "20px",
                right: "24px",
              }}
            />
          </LinkMUI>
        </div>
      </div>
      <div className="sub-header-3" style={{ marginTop: "24px" }}>
        Our Impact
        <div
          className="light-blue d-flex flex-column justify-content-end"
          style={{
            height: "80px",
            width: "88%",
            borderRadius: "10px",
            marginTop: "16px",
            position: "relative",
          }}
        >
          <p
            className="details-1"
            style={{
              height: "48px",
              width: "198px",
              marginTop: "-32px",
              marginBottom: "16px",
              marginLeft: "24px",
              marginRight: "40px",
            }}
          >
            {" "}
            Learn more about the impact we are leaving on the environment.
          </p>
          <LinkMUI href="https://www.dishzero.ca/impact">
            <img
              src={external_link}
              alt="External Link"
              style={{
                position: "absolute",
                top: "19px",
                bottom: "20px",
                right: "24px",
              }}
            />
          </LinkMUI>
        </div>
      </div>
      {content}
    </div>
  );
};

const GetDishes = (dishesUsed) => {
  let dishesInUse = 0;
  return (
    <div id="dishes" style={{ marginTop: "24px" }}>
      <div className="d-flex justify-content-between">
        <p className="sub-header-3">My Dishes</p>
        {dishesUsed.map((dish) => {
          if (dish.returned.timestamp === null) {
            dishesInUse = dishesInUse + 1;
          }
        })}
        <p className="details-2 mt-1">{dishesInUse} in use</p>
      </div>
      {dishesUsed.length ? (
        <DishLog dishes={dishesUsed} />
      ) : (
        <div className="d-flex flex-column">
          <div className="mt-5 d-flex justify-content-center">
            <img src={leaf_green} style={{ transform: "rotate(-90deg)" }} />
            <img
              src={leaf_green}
              style={{ transform: "rotate(-45deg)", marginTop: "-16px" }}
            />
            <img src={leaf_green} />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <p className="details-1 text-center" style={{ maxWidth: "244px" }}>
              You don't have any dishes borrowed at the moment. Start borrowing
              to make an impact!
            </p>
          </div>
          <ReactRouterLink
            className="btn-primary align-self-center mt-2"
            to="/borrow"
            style={{ textDecoration: "none" }}
          >
            <p className="sub-header-3 text-center m-2">Borrow</p>
          </ReactRouterLink>
        </div>
      )}
    </div>
  );
};

const ExistingUser = (dishesUsed) => {
  const content = GetDishes(dishesUsed);
  let dishReturned = 0;
  return (
    <div style={{ padding: "24px" }}>
      <div id="impact" className="sub-header-3">
        My Impact
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "16px" }}
        >
          <div
            className="light-blue d-flex flex-column justify-content-end"
            style={{
              height: "118px",
              width: "48%",
              borderRadius: "10px",
              padding: "16px",
              position: "relative",
            }}
          >
            <img
              src={leaf_white}
              alt="leaf"
              style={{ position: "absolute", top: "16px", right: "16px" }}
            />
            {dishesUsed.map((dish) => {
              if (dish.returned.timestamp != "") {
                // console.log("timestamp:", dish.returned.timestamp)
                dishReturned = dishReturned + 1;
              }
            })}
            <p className="header mb-0">{dishReturned}</p>
            <p className="sub-header-3 mb-1">Dishes Used</p>
          </div>
          <div
            className="light-blue d-flex flex-column justify-content-end"
            style={{
              height: "118px",
              width: "48%",
              borderRadius: "10px",
              padding: "16px",
              position: "relative",
            }}
          >
            <img
              src={leaf_white}
              alt="leaf"
              style={{ position: "absolute", top: "16px", right: "16px" }}
            />
            <div className="d-flex">
              <p className="header mb-0">{dishReturned * 0.5}</p>
              <p
                className="sub-header-2 mb-1"
                style={{ alignSelf: "end", marginLeft: "7px" }}
              >
                Lbs
              </p>
            </div>
            <p className="sub-header-3 mb-1">Waste Diverted</p>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};

const Header = () => {
  return (
    <div>
      <Box sx={{ flexGrow: 1, position: "relative", height: "14vh" }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#68B49A",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "20px", mb: "-24px" }}>
            {" "}
            Home{" "}
          </Typography>
        </AppBar>
      </Box>
    </div>
  );
};

const Footer = () => {
  return (
    <div
      className="position-absolute bottom-0 end-0"
      style={{ padding: "24px" }}
    >
      <ReactRouterLink to={"/borrow"}>
        <img src={scan_icon} alt="scan icon" />
      </ReactRouterLink>
    </div>
  );
};

export default () => {
  const { currentUser, sessionToken } = useAuth();
  const [dishesUsed, setDishesUsed] = useState([]);
  var content;
  console.log(currentUser);
  // Fetch dishes transaction for the user
  useEffect(() => {
    axios
      .get(`${config.serverUrl}/api/transactions`, {
        headers: { "x-api-key": config.apiKey, "session-token": sessionToken },
      })
      .then(function (response) {
        // console.log("response:", response.data)
        setDishesUsed(response.data.transactions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  let user = currentUser;

  if (user) {
    // User is defined
    if (Number(dishesUsed) === 0) {
      content = NewUser(dishesUsed);
    } else {
      content = ExistingUser(dishesUsed);
    }
  }

  return (
    <div>
      <Header />
      {content}
      <Footer />
    </div>
  );
};
