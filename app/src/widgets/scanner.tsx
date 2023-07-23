/////////////////////////////// Import Dependencies ///////////////////////////////
import React, { useState, useEffect } from "react";
import { 
    AppBar,
    InputBase,
    Paper,
    Box, 
    IconButton, 
    Typography } 
from '@mui/material';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import QrReader from "react-qr-scanner";
import 'typeface-poppins';
//////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Sub-components /////////////////////////////////////// 
const CameraInput = ({ onSubmit, frontCamera }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showQr, setShowQr] = useState(false);

    const handleError = (err: any) => {
        console.error(err.message);
        if (err.message === "Permission denied") {
            setErrorMessage("Camera Permission Denied");
        }
        setShowQr(false);
    };

    const handleScan = (data: any) => {
        if (data == null) {
            return;
        }
        onSubmit(data.text);
        console.log(data);
    };

    return (
        <Box sx={styles.qrScannerWrapper}>
            <Box sx={styles.qrScanner} onClick={() => setShowQr(!showQr)}>
                {
                    showQr ? (
                        <QrReader
                            delay={100}
                            style={styles.qr}
                            onError={handleError}
                            onScan={handleScan}
                            facingMode={frontCamera ? "user" : "environment"}
                        />
                    ) : (
                        <Box sx={styles.instructionsFrame}>
                            {
                                errorMessage ? (
                                    <Box sx={styles.errorFrame}>
                                        <ReportGmailerrorredIcon sx={styles.errorIcon}/>
                                        <Typography variant="h6" noWrap component="div" sx={styles.errorMessage}>
                                            {errorMessage}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={styles.enableCameraFrame}>
                                        <CameraAltIcon sx={styles.cameraIcon}/>
                                        <Typography variant="h6" noWrap component="div" sx={styles.enableMessage}>
                                            Tap to enable
                                        </Typography>
                                    </Box>
                                )}
                        </Box>
                    )
                }
            </Box>
        </Box>
    );
};

const BottomTextInput = ({ onSubmit }) => {
    const [ inputDishId, setInputDishId ] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputDishId)
        return false;
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <Box sx={styles.bottomInputFrame}>
            <Paper
                component="form"
                sx={styles.outerInputField}
            >
                <SearchIcon sx={styles.searchIcon}/>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    onChange={(e) => setInputDishId(e.target.value)}
                    onKeyDown={handleEnterKey}
                    placeholder="Enter dish #..."
                    inputProps={{ 'aria-label': 'Enter dish #...' }}
                />
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="search-dish" onClick={handleSubmit}>
                    <SendIcon sx={{ color: '#68B49A' }} />
                </IconButton>
            </Paper>
        </Box>
    )
}


const Header = ({ mode, frontCamera, setFrontCamera }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
      <Box sx={styles.header}>
        <AppBar position="static" sx={styles.appBar}>
          <Box sx={styles.headerBoxLeft}></Box>
          <Box sx={styles.headerBoxLeft}>
            <Typography sx={ isMobile ? styles.headerTitleMobile : styles.headerTitleDesktop }>{mode}</Typography>
          </Box>
          <Box sx={styles.headerBoxRight}>
            <IconButton onClick={() => setFrontCamera(!frontCamera)} sx={{ color: 'white' }}>
                <FlipCameraIosIcon sx={styles.rotateCameraIcon}/>
            </IconButton>
          </Box>
        </AppBar>
      </Box>
    )
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// Main Component ////////////////////////////////////////
export default ({ mode, onScan }) => {
    const onSubmit = (id: string) => onScan(id);
    const [frontCamera, setFrontCamera] = useState(false);

    return (
        <Box sx={styles.root}>
            <Header mode={mode} frontCamera={frontCamera} setFrontCamera={setFrontCamera}/>
            <CameraInput onSubmit={onSubmit} frontCamera={frontCamera} />
            <BottomTextInput onSubmit={onSubmit} />
        </Box>
    );
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////// Styles ////////////////////////////////////
const styles = {
    root: { 
        width: '100%',
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#464646' 
    },

    header: {
        width: '100%',
        height: '120px',
        position: 'fixed'
      },
    
    appBar: {
        backgroundColor:'#68B49A', 
        width: '100%',
        height:'100%', 
        display: 'flex',
        flexDirection: 'row',
        alignItems:"center",
        boxShadow: '0'
    },

    headerBoxLeft: {
        width: '33.333333%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },

    headerBoxRight: {
        width: '33.333333%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '30px',
        paddingRight: '26px'
    },

    headerTitleMobile: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.125rem',
        marginTop: '62px'
    },

    headerTitleDesktop: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.325rem',
        marginTop: '62px'
    },

    appBarLeftFrame: {
        width: '80%', 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center' 
    },

    appBarRightFrame: {
        width: '20%', 
        display: 'flex', 
        justifyContent: 'flex-end'
    },

    rotateCameraIcon: {
        width: '26px',
        height: '26px'
    },

    qrScannerWrapper: {
        width: '100%',
        height: `${window.innerHeight - 100}px`,
        backgroundColor: '#464646',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    qrScanner: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    qr: {
        width: '100%',
        height: '100%'
    },

    instructionsFrame: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorFrame: {
        width: '100%',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    errorIcon: {
        color: 'white',
        width: '45px',
        height: '45px',
        marginBottom: '12px'
    },

    errorMessage: {
        fontSize: '1.225rem',
        color: 'white',
        fontFamily: 'Poppins, sans-serif'
    },

    enableCameraFrame: {
        width: '100%',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    cameraIcon: {
        width: '50px',
        height: '50px',
        color: 'white',
        marginBottom: '13px'
    },

    enableMessage: {
        fontSize: '1.225rem',
        color: 'white',
        fontFamily: 'Poppins, sans-serif'
    },

    bottomInputFrame: {
        width: '100%',
        height: '100px',
        backgroundColor: '#464646',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '0px'
    },

    outerInputField: {
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center',
        width: '80%', 
        height: '50%',
        borderRadius: '25px'
    },

    searchIcon: {
        width: '25px',
        height: '25px',
        marginLeft: '12px'
    }
};
///////////////////////////////////////////////////////////////////////////////