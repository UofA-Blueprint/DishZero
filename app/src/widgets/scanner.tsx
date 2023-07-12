/////////////////////////////// Import Dependencies ///////////////////////////////
import React, { useState } from "react";
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
    InputBase,
    Paper,
    Avatar,
    Box, 
    Drawer, 
    Toolbar, 
    IconButton, 
    Typography, 
    Divider, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText } 
from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import DrawerLogo from "../assets/DishZeroDrawerLogo.png";
import SendIcon from '@mui/icons-material/Send';
import QrReader from "react-qr-scanner";
import 'typeface-poppins';
import { useNavigate } from "react-router-dom";
import { FirebaseAuth } from "../firebase";
//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// Global Declarations ////////////////////////////////////////
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    backgroundColor: '#464646',
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
}));
  
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#68B49A",
    height: '80px',
    justifyContent: 'center',
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));
////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// Sub-components /////////////////////////////////////// 
const Header = ({ open, setOpen, title, frontCamera, setFrontCamera }) => {
    const theme = useTheme();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();

    return (
        <>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Box sx={styles.appBarLeftFrame}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {title}
                        </Typography>
                    </Box>
                    <Box sx={styles.appBarRightFrame}>
                        <IconButton onClick={() => setFrontCamera(!frontCamera)} sx={{ color: 'white' }}>
                            <FlipCameraIosIcon sx={styles.rotateCameraIcon}/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    backgroundColor: "#464646"
                },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader sx={{ paddingTop: '15px', paddingBottom: '20px' }}>
                    <Box sx={{ width: '80%', paddingLeft: '5px' }}>
                        <Avatar alt="DishZero Logo" src={DrawerLogo} sx={{ width: 43, height: 43 }} />
                    </Box>
                    <Box sx={{ width: '20%' }}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ color: 'white' }}/> : <ChevronRightIcon sx={{ color: 'white' }}/>}
                        </IconButton>
                    </Box>
                </DrawerHeader>
                <Divider sx={{ backgroundColor: '#C2C2C2' }} />
                <List>
                    <ListItem key={'Home'} disablePadding>
                        <ListItemButton onClick={() => navigate('/home')}>
                            <ListItemIcon>
                                <HomeIcon sx={{ color: 'white' }}/>
                            </ListItemIcon>
                            <ListItemText primary={'Home'} sx={{ color: 'white' }}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'How it works'} disablePadding>
                        <ListItemButton onClick={() => navigate('/how_it_works')}>
                            <ListItemIcon>
                                <IntegrationInstructionsIcon sx={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary={'How it works'} sx={{ color: 'white' }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Our impact'} disablePadding>
                        <ListItemButton onClick={() => navigate('/our_impact')}>
                            <ListItemIcon>
                                <TrendingUpIcon sx={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary={'Our impact'} sx={{ color: 'white' }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider sx={{ backgroundColor: '#C2C2C2' }} />
                <List>
                    <ListItem key={'Logout'} disablePadding>
                        <ListItemButton onClick={() => FirebaseAuth.signOut()}>
                            <ListItemIcon>
                                <SubdirectoryArrowLeftIcon sx={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary={'Logout'} sx={{ color: 'white' }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    )
}

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
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputDishId)
        return false;
    };

    const handleInputFocus = () => {
        setIsFocused(true);
    };
    
    const handleInputBlur = () => {
        setIsFocused(false);
    };

    return (
        <Box sx={ isFocused ? styles.bottomInputFrameFocussed : styles.bottomInputFrameUnfocussed}>
            <Paper
                component="form"
                sx={styles.outerInputField}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
            >
                <SearchIcon sx={styles.searchIcon}/>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    onChange={(e) => setInputDishId(e.target.value)}
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// Main Component ////////////////////////////////////////
export default ({ mode, onScan }) => {
    const onSubmit = (id: string) => onScan(id);
    const [frontCamera, setFrontCamera] = useState(false);
    const [open, setOpen] = React.useState(false);

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#464646' }}>
            <CssBaseline />
            <Header open={open} setOpen={setOpen} title='Borrow Dishes' frontCamera={frontCamera} setFrontCamera={setFrontCamera} />
            <Main open={open}>
                <>
                    <DrawerHeader />
                    <CameraInput onSubmit={onSubmit} frontCamera={frontCamera} />
                    <BottomTextInput onSubmit={onSubmit} />
                </>
            </Main>
        </Box>
    );
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////// Styles ////////////////////////////////////
const styles = {
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
        height: `${window.innerHeight - 156}px`,
        backgroundColor: '#464646',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    qrScanner: {
        width: '95%',
        height: '90%',
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

    bottomInputFrameUnfocussed: {
        width: '100%',
        height: '100px',
        backgroundColor: '#464646',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 'auto'
    },

    bottomInputFrameFocussed: {
        width: '100%',
        height: '100px',
        backgroundColor: '#464646',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
    },

    outerInputField: {
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center',
        width: '75%', 
        height: '50%',
        borderRadius: '25px',
        marginBottom: 'env(safe-area-inset-bottom)'
    },

    searchIcon: {
        width: '25px',
        height: '25px',
        marginLeft: '7px',
        marginRight: '7px'
    }
};
///////////////////////////////////////////////////////////////////////////////