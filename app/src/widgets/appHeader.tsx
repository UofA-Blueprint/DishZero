import { Box, AppBar, Typography } from '@mui/material'
import React from 'react'

interface Props {
    title: string
}

export const AppHeader = ({ title }: Props) => {
    return (
        <div style={{ height: '25%' }}>
            <Box sx={{ flexGrow: 1, position: 'relative', height: '14vh' }}>
                <AppBar
                    position="static"
                    sx={{ backgroundColor: '#68B49A', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: '500', fontSize: '20px', mb: '-24px' }}> {title} </Typography>
                </AppBar>
            </Box>
        </div>
    )
}
