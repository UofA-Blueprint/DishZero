import { Clear, Search } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { useCallback } from 'react'

interface Props {
    searchQuery: string // the value of the search box
    handleSearch: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void // the function to handle search
}

export default function StyledSearchBox({ searchQuery, handleSearch }: Props) {
    // clear the search box
    const handleClearSearch = useCallback(() => {
        handleSearch({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)
    }, [handleSearch])

    return (
        <Box display="flex">
            <TextField
                placeholder="Search table..."
                size="small"
                sx={{
                    m: '1rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '30px',
                        border: '1px solid',
                    },
                }}
                onChange={handleSearch}
                value={searchQuery}
                margin="dense"
                InputProps={{
                    startAdornment: (
                        // search icon
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        // clear icon (only visible when there is text in the search box)
                        <IconButton
                            style={{ visibility: searchQuery ? 'visible' : 'hidden' }}
                            onClick={handleClearSearch}>
                            <Clear fontSize="small" />
                        </IconButton>
                    ),
                }}
            />
        </Box>
    )
}
