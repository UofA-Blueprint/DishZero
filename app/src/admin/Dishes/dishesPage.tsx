import { useAuth } from '../../contexts/AuthContext'
import adminApi from '../adminApi'
import { Dish } from './constants'
import AdminDishesHeader from './dishesHeader'
import AdminDishesTable from './dishesTable'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

export default function AdminDishes() {
    const { sessionToken } = useAuth()

    const [filteredRows, setFilteredRows] = useState<Dish[]>([]) // rows visible in table
    const [allRows, setAllRows] = useState<Dish[]>([]) // all rows fetched from backend
    const [dishTypes, setDishTypes] = useState<string[]>([])
    const [loadingDishes, setLoadingDishes] = useState(true)

    const fetchDishes = async () => {
        let dishData: Dish[] = []
        if (sessionToken) {
            setLoadingDishes(true)
            dishData = await adminApi.getAllDishes(sessionToken, true)
            setLoadingDishes(false)
        }
        setAllRows(dishData)
    }

    const fetchDishTypes = async () => {
        let dishTypes: string[] = []
        if (sessionToken) {
            dishTypes = await adminApi.getDishTypes(sessionToken)
        }
        setDishTypes(dishTypes)
    }

    useEffect(() => {
        fetchDishes()
        fetchDishTypes()
    }, [])

    // update visible rows if all rows changes
    useEffect(() => {
        setFilteredRows(allRows)
    }, [allRows])

    return (
        <Box sx={{ m: '20px', flex: 1 }}>
            <AdminDishesHeader
                allRows={allRows}
                setFilteredRows={setFilteredRows}
                dishTypes={dishTypes}
                fetchDishTypes={fetchDishTypes}
                // setDishTypes={setDishTypes}
                fetchDishes={fetchDishes}
            />
            <AdminDishesTable
                filteredRows={filteredRows}
                fetchDishes={fetchDishes}
                loadingDishes={loadingDishes}
                dishTypes={dishTypes}
            />
        </Box>
    )
}
