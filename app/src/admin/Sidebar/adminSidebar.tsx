import { Email, Home, Person2, RoomService } from '@mui/icons-material'
import { Drawer, List, ListItemButton, Typography, styled } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebarItem from './adminSidebarItem'
import DishzeroSidebarLogo from '../../assets/dishzero-sidebar-logo.png'

const SIDEBAR_WIDTH = 300

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    whiteSpace: 'nowrap',
    left: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
    width: SIDEBAR_WIDTH,
    '& .MuiDrawer-paper': {
        position: 'absolute',
        backgroundColor: theme.palette.grey[800],
        width: SIDEBAR_WIDTH,
        overflowX: 'hidden',
    },
}))

export default function AdminSidebar() {
    const [open, setOpen] = useState(true)

    const handleDrawerChange = () => {
        setOpen(!open)
    }

    return (
        <StyledDrawer variant="permanent" open={open} onClose={handleDrawerChange}>
            <List>
                <ListItemButton component={Link} to="/" sx={{ m: '0.75rem' }}>
                    <img alt="logo" src={DishzeroSidebarLogo} width="43px" height="43px" />
                    <Typography variant="h5" color="white" marginLeft="0.75rem">
                        DishZero
                    </Typography>
                </ListItemButton>
                <ListItemButton component={Link} to="/" sx={{ m: '0.75rem' }}>
                    <Typography variant="button" color="white" marginLeft="0.75rem">
                        Home
                    </Typography>
                </ListItemButton>
                <ListItemButton component={Link} to="/volunteer/return" sx={{ m: '0.75rem' }}>
                    <Typography variant="button" color="white" marginLeft="0.75rem">
                        Return Dishes
                    </Typography>
                </ListItemButton>
                <ListItemButton component={Link} to="/admin" sx={{ mx: '0.75rem' }}>
                    <Typography variant="button" color="white" marginLeft="0.75rem">
                        Admin Panel
                    </Typography>
                </ListItemButton>
                <AdminSidebarItem url="/admin" icon={<Home />} text="Admin Home" />
                <AdminSidebarItem url="/admin/dishes" icon={<RoomService />} text="Dishes" />
                <AdminSidebarItem url="/admin/users" icon={<Person2 />} text="Users" />
                <AdminSidebarItem url="/admin/email" icon={<Email />} text="Email" />
            </List>
        </StyledDrawer>
    )
}
