import React from "react";
import leaf_icon from "../assets/leaf.svg";
import { BrowserView, MobileView } from "react-device-detect";
import Toolbar from "./toolbar";
import { } from "./styledEmail";
import { StyledAdminPageLayout } from "./styledAdmin";
import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel, TextField } from "@mui/material";

function Email() {
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
                                '& .MuiTextField-root': { m: 2 }
                            }}
                            noValidate
                            autoComplete="off">
                            <TextField
                                id="outlined-basic"
                                label="Subject"
                                variant="outlined" />
                            <TextField
                                id="outlined-multiline-static"
                                label="Content"
                                fullWidth
                                multiline
                                rows={4}
                            />
                            <FormGroup>
                                <FormLabel>Repeat</FormLabel>
                                <FormControlLabel control={<Checkbox />} label="Sunday" />
                                <FormControlLabel control={<Checkbox />} label="Monday" />
                                <FormControlLabel control={<Checkbox />} label="Tuesday" />
                                <FormControlLabel control={<Checkbox />} label="Wednesday" />
                                <FormControlLabel control={<Checkbox />} label="Thursday" />
                                <FormControlLabel control={<Checkbox />} label="Friday" />
                                <FormControlLabel control={<Checkbox />} label="Saturday" />
                            </FormGroup>
                            <div>
                                <Button variant="outlined">Reset</Button>
                                <Button variant="contained" onClick={saveTemplate}>Save Changes</Button>
                            </div>
                        </Box>
                    </div>
                </StyledAdminPageLayout>
            </BrowserView>
        </>
    );
}

function saveTemplate() {
    alert('saved')
}

export default Email;
