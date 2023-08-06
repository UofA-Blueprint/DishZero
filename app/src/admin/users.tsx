////////////////////////// Import Dependencies //////////////////////////
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    FormControl,
    MenuItem,
    InputLabel,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
    FilterList as FilterListIcon,
    Home as HomeIcon,
    DinnerDiningOutlined as DinnerDiningOutlinedIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import axios from "axios";
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
 
interface MainframeProps {
    rows: Data[]
}

interface RoleFilterDialogProps {
    open: boolean;
    handleClose: () => void;
    role: String;
    handleRoleChange: () => void;
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
              sx={{ backgroundColor: '#68B49A', color: 'white' }}
            >
                {
                    headCell.id !== 'role' ?
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            sx={{ 
                                '&:hover': {
                                    color: 'white',
                                    '& .MuiTableSortLabel-icon': {
                                        color: '#dddddd',
                                    },
                                },
                                color: 'white'
                            }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                            ) : null}
                        </TableSortLabel>
                    :
                        <Box sx={styles.roleTableCell}>
                            {headCell.label}
                            <FilterListIcon sx={styles.roleFilterIcon}/>
                        </Box>
                }
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
}

const MainFrame = (props: MainframeProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('inUse');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const rows = props.rows;

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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ),
        [order, orderBy, page, rowsPerPage],
    );

    const [ data, setData ] = useState(visibleRows);
    const [ searchedEmail, setSearchedEmail ] = useState('');

    function handleEmailSearch(text) {
        if (text.length > 0) {
            const filteredRows = data.filter((row) => {
                return row.emailAddress.toLowerCase().includes(text.toLowerCase());
            });
            setSearchedEmail(text);
            setData(filteredRows);
        } else {
            setSearchedEmail(text);
            setData(visibleRows);
        }
    }

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
                        value={searchedEmail}
                        onChange={(e) => handleEmailSearch(e.target.value)}
                        placeholder="search email..."
                        inputProps={{ 'aria-label': 'search email address' }}
                    />
                </Paper>
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
                                data.map((row, index) => {
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
                                    <TableRow style={{ height: 53 * emptyRows }}>
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
            </Paper>
        </Box>
    );
};

function RoleFilterDialog(props: RoleFilterDialogProps) {
    const open = props.open;
    const handleClose = props.handleClose;
    const role = props.role;
    const handleRoleChange = props.handleRoleChange;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Select role</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Display only the users whose role is:
                </DialogContentText>
                <Box
                    noValidate
                    component="form"
                    sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: 'auto',
                    width: 'fit-content',
                    }}
                >
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel htmlFor="max-width">role</InputLabel>
                        <Select
                            autoFocus
                            value={role}
                            onChange={handleRoleChange}
                            label="maxWidth"
                        >
                            <MenuItem value="BASIC">BASIC</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                            <MenuItem value="VOLUNTEER">VOLUNTEER</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
}
/////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// Main component //////////////////////////////
export default function Users() {
    const location = useLocation();
    let sessionToken = location.state;
    const [ rows, setRows ] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/users',
                {headers:{"x-api-key":"test","session-token":sessionToken}}
            );
            const { data } = response;
            let users : {}[] = [];
            await Promise.all(
                data.users.map((user) => {
                    users.push(user);
                })
            );
            return users;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/transactions',
                {headers:{"x-api-key":"test","session-token":sessionToken}}
            );
            const { data } = response;
            let transactions : {}[] = [];
            await Promise.all(
                data.transactions.map((transaction) => {
                    transactions.push(transaction);
                })
            );
            return transactions;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    useEffect(() => {
        // call users and transactions api
        const setUpData =  async () => {
            const users = await fetchUsers();
            const transactions = await fetchTransactions();
        };
        setUpData();
    }, []);

    const [openedRoleFilter, setOpenedRoleFilter] = React.useState(false);

    const handleRoleFilterOpen = () => {
        setOpenedRoleFilter(true);
    };
    
    const handleRoleFilterClose = () => {
        setOpenedRoleFilter(false);
    };

    const [ role, setRole ] = useState('');

    const handleRoleChange = (e) => {
        setRole(e.target.checked);
    };

    return (
        <Box sx={styles.root}>
            <Sidebar />
            <MainFrame rows={rows}/>
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
    },

    roleTableCell: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: 'white'
    },

    roleFilterIcon: {
        fontSize: '1.065rem',
        marginLeft: '8px',
        '&:hover': {
            color: '#dddddd',
        },
        cursor: 'pointer'
    }
};
///////////////////////////////////////////////////////////////////////