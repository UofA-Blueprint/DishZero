import Toolbar from '../toolbar'
import { Dish } from './constants'
import AdminDishesHeader from './dishesHeader'
import AdminDishesTable from './dishesTable'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

export default function AdminDishes() {
    const [filteredRows, setFilteredRows] = useState<Dish[]>([])
    const [allRows, setAllRows] = useState<Dish[]>([])

    // update visible rows if all rows changes
    useEffect(() => {
        setFilteredRows(allRows)
    }, [allRows])

    return (
        <Box display="flex">
            <Toolbar />
            <Box sx={{ m: '20px', flex: 1 }}>
                <AdminDishesHeader allRows={allRows} setFilteredRows={setFilteredRows} />
                <AdminDishesTable filteredRows={filteredRows} setAllRows={setAllRows} />
            </Box>
        </Box>
    )
}
