import { Add } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import AddNewDishDialog from './addNewDish'
import { Dish, StyledContainedButton } from './constants'
import { requestSearch } from '../DataGrid/constants'
import StyledSearchBox from '../DataGrid/searchBox'

interface Props {
    allRows: Dish[]
    setRows: React.Dispatch<React.SetStateAction<Dish[]>>
}

export default function AdminDishesHeader({ allRows, setRows }: Props) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const handleSearch = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const newSearchQuery = e.target.value
        requestSearch(newSearchQuery, allRows, setRows)
        setSearch(newSearchQuery)
    }

    return (
        <>
            <Typography variant="h4" fontWeight="bold">
                Dish Data
            </Typography>
            <Box
                display="flex"
                flexDirection="row"
                sx={{ mb: '1rem', justifyContent: 'space-between' }}
                width="100%"
                alignItems={'center'}>
                <StyledSearchBox search={search} handleSearch={handleSearch} />
                <Box display="flex" alignItems={'center'}>
                    <StyledContainedButton variant="contained" startIcon={<Add></Add>} onClick={() => setOpen(true)}>
                        Add new dish
                    </StyledContainedButton>
                </Box>
            </Box>
            <AddNewDishDialog open={open} setOpen={setOpen} />
        </>
    )
}
