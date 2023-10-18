import { Clear, Search } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { StyledOutlinedButton } from '../Dishes/constants'

interface Props {
    search: string
    handleSearch: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

export default function StyledSearchBox({ search, handleSearch }: Props) {
    return (
        <Box display="flex" alignItems={'center'}>
            <TextField
                placeholder="Search data..."
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
    )
}
