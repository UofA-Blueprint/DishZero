import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Drawer, Toolbar, IconButton, Button, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import {
    faCameraRotate,
    faVideoCamera,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import QrReader from "react-qr-scanner";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
        backgroundColor: "#68B49A",
        paddingTop: '10px',
        paddingBottom: '10px',
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

const Header = ({ title }) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <AppBar position="fixed" open={open}>
                <Toolbar>
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
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ color: 'white' }}/> : <ChevronRightIcon sx={{ color: 'white' }}/>}
                    </IconButton>
                </DrawerHeader>
                <Divider sx={{ backgroundColor: '#C2C2C2' }} />
                <List>
                    <ListItem key={'Home'} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon sx={{ color: 'white' }}/>
                            </ListItemIcon>
                            <ListItemText primary={'Home'} sx={{ color: 'white' }}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'How it works'} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <IntegrationInstructionsIcon sx={{ color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary={'How it works'} sx={{ color: 'white' }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'Our impact'} disablePadding>
                        <ListItemButton>
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
                        <ListItemButton>
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

const BottomTextInput = ({ onSubmit }) => {
    let [input, setInput] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(input)
        return false;
    }
    return (
        <div className="start-0 position-fixed bottom-0 w-100 px-5" >
            <div>
                <Form onSubmit={handleSubmit}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className="search-bar">
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                        <Form.Text className="text-muted">
                        </Form.Text>
                        <Form.Control className="search-bar" value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Enter dish id #" />
                        <Button onSubmit={handleSubmit} variant="light" type="submit" className="mr-sm-2 search-bar search-button">
                            Enter
                        </Button>
                    </InputGroup >
                </Form>
            </div>
        </div>
    )
}

const CameraInput = ({ onSubmit }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [frontCamera, setFrontCamera] = useState(false);

    const style = { height: "100%" };
    const handleError = (err: any) => {
        console.error(err.message)
        if (err.message === "Permission denied") {
            setErrorMessage("Camera Permission Denied")
        }
        setShowQr(false)
    };
    const handleScan = (data: any) => {
        if (data == null) {
            return;
        }
        onSubmit(data.text);
        console.log(data);
    };
    return (
        <div className="qr-scanner-wrapper">
            <br />
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {/* TODO: Disable setFacingMode when only one camera is available */}
            </div>
            <div
                className="qr-scanner-placeholder"
                style={style}
            >
                <div className="position-absolute">
                    <Button
                        variant="secondary"
                        onClick={() => setFrontCamera(!frontCamera)}
                    >
                        <FontAwesomeIcon icon={faCameraRotate} />
                    </Button>
                </div>

                <div className="qr-scanner-tag" onClick={() => setShowQr(!showQr)}>
                    {/* <div className="crosshair"/> */}

                    {showQr ? (
                        <QrReader
                            delay={100}
                            style={style}
                            onError={handleError}
                            onScan={handleScan}
                            // TODO: determine based off https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
                            facingMode={frontCamera ? "user" : "environment"}
                        />
                    ) : (
                        <div>
                            {" "}
                            {errorMessage ? (errorMessage) : (<><FontAwesomeIcon icon={faVideoCamera} /> Camera Disabled <br />{" "}
                                <p style={{ fontSize: "0.8em" }}>Tap to Enable</p>{errorMessage}</>)}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ({ mode, onScan }) => {
    const onSubmit = (id: string) => onScan(id)

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header title='Borrow Dishes'>
                <Main open={open}>
                    <div className="scanner-wrapper">
                        {/* ScanQRCode */}
                        <div style={{ height: "100vh", width: "80%", display: "block" }}>
                            <Header title={mode} style={{ top: 0, left: 0, position: "fixed", width: "100%" }} />
                            <CameraInput onSubmit={onSubmit} />
                            <BottomTextInput onSubmit={onSubmit} />
                        </div>
                    </div>
                </Main>
            </Header>
        </Box>
    )
}