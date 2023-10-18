/*eslint-disable*/
import { styled } from '@mui/material'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'

export const requestSearch = (
    searchValue: string,
    rows: any[],
    setRows: React.Dispatch<React.SetStateAction<any[]>>
) => {
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = rows.filter((row: any) => {
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

export const StyledDataGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
    '& .MuiDataGrid-columnHeaders': {
        '& svg': {
            fill: 'white',
        },
        backgroundColor: theme.palette.grey[800],
        color: 'white',
    },
    '& .MuiDataGrid-columnHeaderTitleContainerContent span': {
        color: 'white',
    },
    '& .MuiTablePagination-selectLabel': {
        marginBottom: '0px',
    },
    '& .MuiTablePagination-displayedRows': {
        marginBottom: '0px',
    },
    '& .MuiDataGrid-row': {
        cursor: 'pointer',
    },
}))
