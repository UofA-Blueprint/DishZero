import Toolbar from '../toolbar'
import { dishes } from './constants'
import AdminDishesHeader from './dishesHeader'
import AdminDishesTable from './dishesTable'
import { Box } from '@mui/material'
import { useState } from 'react'

export default function AdminDishes() {
    const [rows, setRows] = useState(dishes)
    return (
        <Box display="flex">
            <Toolbar />
            <Box sx={{ m: '20px' }}>
                <AdminDishesHeader allRows={dishes} setRows={setRows} />
                <AdminDishesTable rows={rows} setRows={setRows} />
            </Box>
        </Box>
    )
}
