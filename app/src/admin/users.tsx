////////////////////////// Import Dependencies //////////////////////////
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Switch,
    FormControlLabel,
    TableSortLabel,
    Button,
    Avatar,
    Typography,
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
import { visuallyHidden } from '@mui/utils';
import axios from "axios";
//////////////////////////////////////////////////////////////////////////////

//////////////////////////// Declarations ////////////////////////////
interface HeadCell {
    id: 'emailAddress' | 'inUse' | 'overdue' | 'role';
    label: string;
    minWidth?: number;
    align?: 'right' | 'left';
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    { 
        id: 'emailAddress', 
        label: 'Email Address', 
        minWidth: 200,
        numeric: false,
        align: 'left'
    },
    { 
        id: 'inUse', 
        label: 'In Use', 
        minWidth: 170,
        numeric: true,
        align: 'right'
    },
    {
        id: 'overdue',
        label: 'Overdue',
        minWidth: 90,
        numeric: true,
        align: 'right'
    },
    {
        id: 'role',
        label: 'Role',
        minWidth: 170,
        numeric: false,
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
    createData('thiminhh@ualberta.ca', 3, 4, 'Basic'),
    createData('one@ualberta.ca', 3, 4, 'Basic'),
    createData('two@ualberta.ca', 5, 4, 'Basic'),
    createData('three@ualberta.ca', 3, 4, 'Basic'),
    createData('four@ualberta.ca', 3, 4, 'Basic'),
    createData('five@ualberta.ca', 3, 4, 'Basic'),
    createData('six@ualberta.ca', 3, 4, 'Basic'),
    createData('seven@ualberta.ca', 3, 4, 'Basic'),
    createData('eight@ualberta.ca', 3, 4, 'Basic'),
    createData('nine@ualberta.ca', 3, 4, 'Basic'),
    createData('ten@ualberta.ca', 3, 4, 'Basic'),
    createData('eleven@ualberta.ca', 3, 4, 'Basic'),
    createData('twelve@ualberta.ca', 3, 4, 'Basic'),
    createData('thirteen@ualberta.ca', 3, 4, 'Basic'),
    createData('fourteen@ualberta.ca', 3, 4, 'Basic'),
    createData('fifteen@ualberta.ca', 3, 4, 'Basic'),
    createData('sixteen@ualberta.ca', 3, 4, 'Basic'),
    createData('seventeen@ualberta.ca', 3, 4, 'Basic'),
    createData('eighteen@ualberta.ca', 3, 4, 'Basic'),
    createData('nineteen@ualberta.ca', 3, 4, 'Basic'),
    createData('twenty@ualberta.ca', 3, 4, 'Basic'),
    createData('twentyone@ualberta.ca', 3, 4, 'Basic'),
    createData('twentytwo@ualberta.ca', 3, 4, 'Basic')
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
 
interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
}
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

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } =
      props;
    const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
  
    return (
      <TableHead >
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ backgroundColor: '#464646' }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                style={{ color: 'white' }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
}

const MainFrame = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('inUse');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    useEffect(() => {
        // call users api
    }, []);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
      ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ),
        [order, orderBy, page, rowsPerPage],
    );

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
            <Paper sx={styles.dataPaper}>
                <TableContainer sx={styles.dataTable}>
                    <Table stickyHeader aria-label="sticky table">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                visibleRows.map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.emailAddress} sx={{ cursor: 'pointer' }}>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="normal"
                                            >
                                                {row.emailAddress}
                                            </TableCell>
                                            <TableCell align="right">{row.inUse}</TableCell>
                                            <TableCell align="right">{row.overdue}</TableCell>
                                            <TableCell align="right">{row.role}</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                            {
                                emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
            </Paper>
        </Box>
    );
};
/////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// Main component //////////////////////////////
export default function Users() {
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
    },

    dataPaper: { 
        width: '95.5%', 
        overflow: 'hidden',
        marginTop: '35px',
        boxShadow: '0'
    },

    dataTable: {
        maxHeight: `${window.innerHeight - 300}px`
    }
};
///////////////////////////////////////////////////////////////////////