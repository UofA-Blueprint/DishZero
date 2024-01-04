import { Add } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import AddNewDishDialog from './addNewDish'
import { Dish, StyledContainedButton } from './constants'
import { searchGrid } from '../DataGrid/constants'
import StyledSearchBox from '../DataGrid/searchBox'

interface Props {
    allRows: Dish[]
    setFilteredRows: React.Dispatch<React.SetStateAction<Dish[]>>
    fetchDishes: () => void
    dishTypes: string[]
    fetchDishTypes: () => void
}

export default function AdminDishesHeader({ allRows, setFilteredRows, fetchDishes, dishTypes, fetchDishTypes }: Props) {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const newSearchQuery = e.target.value
        searchGrid(newSearchQuery, allRows, setFilteredRows)
        setSearchQuery(newSearchQuery)
    }

    return (
        <Box sx={{ maxWidth: 1300 }}>
            <Typography variant="h4" fontWeight="bold">
                Dish Data
            </Typography>
            <Box display="flex" flexDirection="row" sx={{ mb: '1rem', justifyContent: 'space-between' }}>
                <StyledSearchBox searchQuery={searchQuery} handleSearch={handleSearch} />
                <Box display="flex" alignItems={'center'}>
                    <StyledContainedButton variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                        Add new dishes
                    </StyledContainedButton>
                </Box>
            </Box>
            <AddNewDishDialog
                open={open}
                setOpen={setOpen}
                dishTypes={dishTypes}
                fetchDishTypes={fetchDishTypes}
                fetchDishes={fetchDishes}
            />
        </Box>
    )
}
