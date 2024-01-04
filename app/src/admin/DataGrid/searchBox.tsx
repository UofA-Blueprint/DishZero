import { Clear, Search } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
// import { StyledOutlinedButton } from '../Dishes/constants'
// import { useState } from 'react'

interface Props {
    search: string
    handleSearch: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

// TODO Only search when button is pressed?
// Then would need a clear button?
// or does this work for now?

export default function StyledSearchBox({ search, handleSearch }: Props) {
    // const [searchValue, setSearchValue] = useState<string>('')
    return (
        <Box display="flex" alignItems={'center'}>
            <TextField
                placeholder="Search data..."
                size="small"
                sx={{
                    m: '1rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: '30px',
                        border: '1px solid',
                    },
                    height: 'fit-content',
                }}
                // onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                //     setSearchValue(event.target.value)
                // }
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
            {/* <StyledOutlinedButton>Search</StyledOutlinedButton> */}
        </Box>
    )
}
