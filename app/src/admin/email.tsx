import React, { useState } from "react";
import leaf_icon from "../assets/leaf.svg";
import { BrowserView, MobileView } from "react-device-detect";
import Toolbar from "./toolbar";
import {} from "./styledEmail";
import { StyledAdminPageLayout } from "./styledAdmin";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Email() {
  const { sessionToken } = useAuth();
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  function handleDayChange(day) {
    setDays((prev) => ({
        ...prev,
        [day]: !prev[day]
    }))
  }



  async function saveTemplate() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/email/template`,
        {
          template: {
            subject,
            content,
          },
        },
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_API_KEY}`,
            "session-token": sessionToken,
          },
        }
      );

      if (response && response.status === 200) {
        alert("Template saved!");
      } else {
        console.log("data", response.data);
        alert("Unable to save email template");
      }
    } catch (error: any) {
        console.log(error);
        alert("Unable to save email template");
    }
  }

  function resetInputValues() {
    setSubject('')
    setContent('')
    setDays({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      })
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
        <StyledAdminPageLayout>
          <Toolbar />
          <div>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Subject"
                variant="outlined"
                value={subject}
                onChange={(e) => {setSubject(e.target.value)}} 
              />
              <TextField
                id="outlined-multiline-static"
                label="Content"
                fullWidth
                multiline
                rows={4}
                value={content}
                onChange={(e) => {setContent(e.target.value)}} 
              />
              <FormGroup>
                <FormLabel>Repeat</FormLabel>
                <FormControlLabel control={<Checkbox checked={days.sunday} onChange={() => handleDayChange("sunday")}/>} label="Sunday" />
                <FormControlLabel control={<Checkbox checked={days.monday} onChange={() => handleDayChange("monday")}/>} label="Monday" />
                <FormControlLabel control={<Checkbox checked={days.tuesday} onChange={() => handleDayChange("tuesday")}/>} label="Tuesday" />
                <FormControlLabel control={<Checkbox checked={days.wednesday} onChange={() => handleDayChange("wednesday")}/>} label="Wednesday" />
                <FormControlLabel control={<Checkbox checked={days.thursday} onChange={() => handleDayChange("thursday")}/>} label="Thursday" />
                <FormControlLabel control={<Checkbox checked={days.friday} onChange={() => handleDayChange("friday")}/>} label="Friday" />
                <FormControlLabel control={<Checkbox checked={days.saturday} onChange={() => handleDayChange("saturday")}/>} label="Saturday" />
              </FormGroup>
              <div>
                <Button variant="outlined" onClick={resetInputValues}>Reset</Button>
                <Button variant="contained" onClick={saveTemplate}>
                  Save Changes
                </Button>
              </div>
            </Box>
          </div>
        </StyledAdminPageLayout>
      </BrowserView>
    </>
  );
}

export default Email;
