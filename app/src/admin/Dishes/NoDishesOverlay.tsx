import { Typography } from '@mui/material'
import { GridOverlay } from '@mui/x-data-grid'
import { WebAsset } from '@mui/icons-material'

export default function NoDishesOverlay() {
    return (
        <GridOverlay style={{ flexDirection: 'column', marginTop: 4, marginBottom: 2 }}>
            <WebAsset color="action" fontSize="large" />
            <Typography mt={1} variant="overline">
                No dishes
            </Typography>
        </GridOverlay>
    )
}
