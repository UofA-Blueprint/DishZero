import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { ReactNode } from 'react'

export default function CustomToolbar({ children }: { children: ReactNode }) {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton sx={{ color: 'secondary.main' }} />
            <GridToolbarExport sx={{ color: 'secondary.main' }} />
            {children}
        </GridToolbarContainer>
    )
}
