import { Add, IosShare, Search, Clear } from '@mui/icons-material'
import { Box, Button, IconButton, InputAdornment, TextField, Typography, styled } from '@mui/material'
import { useState } from 'react'
import AddNewDishDialog from './addNewDish'
import { Dish } from '../constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledOutlinedButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    border: '2px solid #68B49A !important',
    '&:hover': {
        backgroundColor: '#68B49A11',
    },
    padding: '0.5rem 2rem !important',
    color: '#68B49A',
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledContainedButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    backgroundColor: '#68B49A',
    '&:hover': {
        backgroundColor: '#68B49Aee',
    },
    padding: '0.5rem 2rem',
    margin: '1rem',
}))

const requestSearch = (searchValue: string, rows: Dish[], setRows: React.Dispatch<React.SetStateAction<Dish[]>>) => {
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = rows.filter((row: Dish) => {
        return Object.keys(row).some((field: string) => {
            return searchRegex.test((row[field] || '').toString())
        })
    })
    setRows(filteredRows)
}

// remove characters that could cause errors
const escapeRegExp = (value: string): string => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

interface Props {
    allRows: Dish[]
    setRows: React.Dispatch<React.SetStateAction<Dish[]>>
}

export default function AdminDishHeader({ allRows, setRows }: Props) {
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
                <Box display="flex" alignItems={'center'}>
                    <TextField
                        placeholder="Search dish..."
                        size="small"
                        sx={{
                            color: '#C2C2C2',
                            m: '1rem',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: '30px',
                                border: '1px solid #464646',
                            },
                            height: 'fit-content',
                        }}
                        onChange={handleSearch}
                        value={search}
                        margin="dense"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <IconButton
                                    size="small"
                                    style={{ visibility: search ? 'visible' : 'hidden' }}
                                    onClick={() =>
                                        handleSearch({ target: { value: '' } } as React.ChangeEvent<
                                            HTMLTextAreaElement | HTMLInputElement
                                        >)
                                    }>
                                    <Clear fontSize="small" />
                                </IconButton>
                            ),
                        }}
                    />
                    <StyledOutlinedButton>Search</StyledOutlinedButton>
                </Box>
                <Box display="flex" alignItems={'center'}>
                    <StyledOutlinedButton startIcon={<IosShare></IosShare>}>Export Data</StyledOutlinedButton>
                    <StyledContainedButton variant="contained" startIcon={<Add></Add>} onClick={() => setOpen(true)}>
                        Add new dish
                    </StyledContainedButton>
                </Box>
            </Box>
            <AddNewDishDialog open={open} setOpen={setOpen} />
        </>
    )
}
