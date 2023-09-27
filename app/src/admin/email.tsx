import React, { useEffect, useState } from "react";
import leaf_icon from "../assets/leaf.svg";
import { BrowserView, MobileView } from "react-device-detect";
import Toolbar from "./toolbar";
import {} from "./styledEmail";
import { StyledAdminPageLayout } from "./styledAdmin";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  Fade,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
function Email() {
  const { sessionToken } = useAuth();
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    // get data from backend and set state
    getInfo();
  }, []);

  async function getInfo() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/cron/email/`,
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-token": sessionToken,
          },
        }
      );

      if (!(response && response.status === 200)) {
        console.log("data", response.data);
        alert(
          "Unable to get saved template! Make sure you enter all fields before saving."
        );
        return;
      } else {
        const data = response.data;
        setContent(data.cron.body);
        setSubject(data.cron.subject);
        const daysArr = (data.cron.expression as String).split(" ");
        const daysExpr = daysArr[daysArr.length - 1] as string;
        console.log(daysExpr);
        const exprMap = {
          MON: "monday",
          TUE: "tuesday",
          WED: "wednesday",
          THU: "thursday",
          FRI: "friday",
          SAT: "saturday",
          SUN: "sunday",
        };
        let days = {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        };
        for (let day of daysExpr.split(",")) {
          days[exprMap[day]] = true;
        }
        setDays(days);
      }
    } catch (error: any) {
      console.log(error);
      alert(
        "Unable to get saved template! Make sure you enter all fields before saving."
      );
      return;
    }
  }

  function handleDayChange(day) {
    setDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  }

  function DayCheckBox(day) {
    return (
      <Avatar
        variant="square"
        sx={{
          background: `${days[day] ? "#68B49A" : "white"}`,
          color: `${days[day] ? "white" : "#757575"}`,
          borderRadius: "20%",
          fontSize: "16px",
        }}
        onClick={() => handleDayChange(day)}
      >
        {day[0].toUpperCase()}
      </Avatar>
    );
  }

  function SuccessAlert() {
    return (
      <Fade appear={false} in={successOpen}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: 'fixed',
            width: '100%',
            left: 100,
            right: 0,
          }}
        >
          <Alert sx={{ width: "50%"}}>Changes saved.</Alert>
        </Box>
      </Fade>
    );
  }

  function ErrorAlert() {
    return (
      <Fade appear={false} in={errorOpen}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: 'fixed',
            width: '100%',
            left: 100,
            right: 0,
          }}
        >
          <Alert severity="error" sx={{ width: "50%"}}>Error. Please try again.</Alert>
        </Box>
      </Fade>
    );
  }

  async function saveTemplate() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/cron/email/template`,
        {
          template: {
            subject: subject,
            body: content,
          },
        },
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-token": sessionToken,
          },
        }
      );

      if (!(response && response.status === 200)) {
        console.log("data", response.data);

        return;
      }
    } catch (error: any) {
      console.log(error);
      setErrorOpen(true);
      setTimeout(() => {
        setErrorOpen(false);
      }, 2000);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/cron/email/expression`,
        {
          days,
        },
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-token": sessionToken,
          },
        }
      );

      if (response && response.status === 200) {
        setSuccessOpen(true);
        setTimeout(() => {
          setSuccessOpen(false);
        }, 2000);
      } else {
        console.log("data", response.data);
        setErrorOpen(true);
        setTimeout(() => {
          setErrorOpen(false);
        }, 2000);
      }
    } catch (error: any) {
      console.log(error);
      setErrorOpen(true);
      setTimeout(() => {
        setErrorOpen(false);
      }, 2000);
    }
  }

  function resetInputValues() {
    setSubject("");
    setContent("");
    setDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  }

  return (
    <>
      {/* on mobile */}
      <MobileView>
        <div>
          <h1>Admin Panel</h1>
        </div>

        <img src={leaf_icon} alt="" />
        <h2>You're on mobile! Please go to desktop to view admin panel.</h2>
      </MobileView>

      {/* on desktop */}
      <BrowserView>
        <Box sx={{ display: "flex" }}>
          <Toolbar />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              marginLeft: "40px",
              marginTop: "40px",
              height: "28px",
            }}
          >
            {SuccessAlert()}
            {ErrorAlert()}
            {/* heading */}
            <Typography
              gutterBottom
              sx={{
                lineHeight: "36px",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              Configure Overdue Email
            </Typography>

            {/* subject */}
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                marginTop: "40px",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  weight: "500",
                  fontWeight: "bold",
                }}
              >
                Subject
              </Typography>

              <TextField
                id="outlined-basic"
                variant="outlined"
                value={subject}
                placeholder="Type subject here..."
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                size="small"
                sx={{
                  marginLeft: "120px",
                  width: "80%",
                }}
              />
            </Box>

            {/* content */}
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                marginTop: "40px",
                alignItems: "baseline",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  weight: "500",
                  fontWeight: "bold",
                }}
              >
                Content
              </Typography>

              <TextField
                id="outlined-basic"
                variant="outlined"
                value={content}
                placeholder="Type subject here..."
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                sx={{
                  marginLeft: "120px",
                  width: "80%",
                }}
                multiline
                rows={12}
              />
            </Box>

            {/* checkboxes and button */}
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                marginTop: "40px",
                alignItems: "baseline",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                  weight: "500",
                  fontWeight: "bold",
                }}
              >
                Repeat
              </Typography>

              <Box sx={{ marginLeft: "120px" }}>{DayCheckBox("sunday")}</Box>
              <Box sx={{ marginLeft: "8px" }}>{DayCheckBox("monday")}</Box>
              <Box sx={{ marginLeft: "8px" }}>{DayCheckBox("tuesday")}</Box>
              <Box sx={{ marginLeft: "8px" }}>{DayCheckBox("wednesday")}</Box>
              <Box sx={{ marginLeft: "8px" }}>{DayCheckBox("thursday")}</Box>
              <Box sx={{ marginLeft: "8px" }}>{DayCheckBox("friday")}</Box>
              <Box sx={{ marginLeft: "8px" }}>{DayCheckBox("saturday")}</Box>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginRight: "120px",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={resetInputValues}
                  sx={{
                    ":hover": {
                      borderColor: "#68B49A",
                    },
                    color: "#68B49A",
                    borderRadius: "30px",
                    borderColor: "#68B49A",
                    width: "100px",
                  }}
                >
                  Reset
                </Button>

                <Button
                  variant="contained"
                  onClick={saveTemplate}
                  sx={{
                    ":hover": {
                      background: "#68B49A",
                    },
                    background: "#68B49A",
                    color: "white",
                    borderRadius: "30px",
                    width: "200px",
                    marginLeft: "20px",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </BrowserView>
    </>
  );
}

export default Email;
