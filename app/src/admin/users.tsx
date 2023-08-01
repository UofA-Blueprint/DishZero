////////////////////////// Import Dependencies //////////////////////////
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Button,
    Avatar,
    Typography,
    AppBar,
    Box,
    Paper,
    InputBase,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material';
import DishzeroSidebarLogo from '../assets/dishzero-sidebar-logo.png';
import 'typeface-poppins';
import { 
    Home as HomeIcon,
    DinnerDiningOutlined as DinnerDiningOutlinedIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Search as SearchIcon
} from '@mui/icons-material';
//////////////////////////////////////////////////////////////////////////////

//////////////////////////// Declarations ////////////////////////////
interface Column {
    id: 'emailAddress' | 'inUse' | 'overdue' | 'role';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { 
        id: 'emailAddress', 
        label: 'Email Address', 
        minWidth: 200 
    },
    { 
        id: 'inUse', 
        label: 'In Use', 
        minWidth: 170 
    },
    {
      id: 'overdue',
      label: 'Overdue',
      minWidth: 90,
      align: 'right'
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 170,
      align: 'right'
    }
];

interface Data {
    emailAddress: string;
    inUse: number;
    overdue: number;
    role: string;
}

function createData(
    emailAddress: string,
    inUse: number,
    overdue: number,
    role: string
  ): Data {
    return { emailAddress, inUse, overdue, role };
}

const rows = [
    createData('bhphan@ualberta.ca', 2, 1, 'Admin'),
    createData('hoangtru@ualberta.ca', 4, 5, 'Volunteer'),
    createData('dtho@ualberta.ca', 6, 7, 'Basic'),
    createData('thiminhh@ualberta.ca', 3, 4, 'Basic')
];
//////////////////////////////////////////////////////////////

/////////////////////////////// Sub-components ///////////////////////////////
const Tab = ({ children, route }) => {
    const navigate = useNavigate();

    return (
        <Button sx={ route === "/admin/users" ? styles.tabActive : styles.tabInactive } variant="text"  onClick={() => navigate(route)} disableElevation>
            { children }
        </Button>
    );
}

const Sidebar = () => {
    return (
      <Box sx={styles.sidebar}>
        <Box sx={styles.logoFrame}>
            <Avatar src={DishzeroSidebarLogo} sx={styles.dishzeroSidebarLogo} />
            <Typography sx={styles.dishzeroName}>DishZero</Typography>
        </Box>
        <Box sx={styles.tabsFrame}>
            <Typography sx={styles.adminPanelText}>Admin panel</Typography>
            <Tab route="/home">
                <HomeIcon sx={styles.tabIcon}/>
                <Typography sx={styles.tabName}>Home</Typography>
            </Tab>
            <Tab route="/admin/dishes">
                <DinnerDiningOutlinedIcon sx={styles.tabIcon}/>
                <Typography sx={styles.tabName}>Dishes</Typography>
            </Tab>
            <Tab route="/admin/users">
                <PersonIcon sx={styles.tabIcon}/>
                <Typography sx={styles.tabName}>Users</Typography>
            </Tab>
            <Tab route="/admin/email">
                <EmailIcon sx={styles.tabIcon}/>
                <Typography sx={styles.tabName}>Email</Typography>
            </Tab>
        </Box>
      </Box>
    )
}

const MainFrame = () => {
    const [ data, setData ] = useState('');

    const handleSubmit = (e) => {
        setData(e.target.value);
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <Box sx={styles.main}>
            <Typography sx={styles.pageName}>Users</Typography>
            <Box sx={styles.searchFrame}>
                <Paper
                    component="form"
                    sx={styles.searchField}
                >
                    <SearchIcon />
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        onKeyDown={handleEnterKey}
                        placeholder="search email..."
                        inputProps={{ 'aria-label': 'search email address' }}
                    />
                </Paper>
                <Button variant="outlined" sx={styles.searchButton} onClick={handleSubmit}>
                    Search
                </Button>
            </Box>
        </Box>
    );
};
/////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// Main component //////////////////////////////
export default function Users() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box sx={styles.root}>
            <Sidebar />
            <MainFrame />
        </Box>
    );
}
/////////////////////////////////////////////////////////////////////////

//////////////////////////// Styles ////////////////////////////
const styles = {
    root: {
        width: '100%',
        height: `${window.innerHeight}px`,
        display: 'flex',
        flexDirection: 'row'
    },

    sidebar: {
        width: '20%',
        height: '100%',
        backgroundColor: "#464646",
        display: 'flex',
        flexDirection: 'column'
    },

    logoFrame: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '25px',
        marginLeft: '25px',
    },

    dishzeroSidebarLogo: {
        width: '40px',
        height: '40px'
    },

    dishzeroName: {
        fontSize: '1.425rem',
        fontFamily: 'Poppins, sans-serif',
        color: 'white',
        marginLeft: '20px'
    },

    tabsFrame: {
        width: '100%',
        marginTop: '45px',
        display: 'flex',
        flexDirection: 'column'
    },

    adminPanelText: {
        fontSize: '1.025rem',
        fontFamily: 'Poppins, sans-serif',
        color: '#C2C2C2',
        marginBottom: '37px',
        marginLeft: '25px'
    },

    tabInactive: {
        width: '100%',
        height: '53px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: '25px',
        alignItems: 'center',
        marginBottom: '26px',
        backgroundColor: '#464646',
        '&:hover': {
            backgroundColor: '#5E5E5E', // Change this to the desired hover color
        },
    },

    tabActive: {
        width: '100%',
        height: '53px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: '25px',
        alignItems: 'center',
        marginBottom: '26px',
        backgroundColor: '#5E5E5E',
        '&:hover': {
            backgroundColor: '#5E5E5E', // Change this to the desired hover color
        },
    },

    tabIcon: {
        fontSize: '2rem',
        color: '#F6F8F5'
    },

    tabName: {
        marginTop: '2px',
        marginLeft: '16px',
        fontSize: '1.125rem',
        color: '#F6F8F5',
    },

    main: {
        width: '80%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '50px'
    },

    pageName: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginTop: '40px'
    },

    searchFrame: {
        marginTop: '20px',
        width: '400px',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    searchField: { 
        p: '2px 12px', 
        display: 'flex',
        alignItems: 'center', 
        width: '65%',
        height: '80%',
        boxShadow: '0',
        borderWidth: '1.3px',
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: '20px'
    },

    searchButton: {
        marginLeft: '10px',
        width: '30%',
        height: '80%',
        color: '#68B49A',
        borderColor: '#68B49A',
        borderRadius: '20px'
    }
};
///////////////////////////////////////////////////////////////////////