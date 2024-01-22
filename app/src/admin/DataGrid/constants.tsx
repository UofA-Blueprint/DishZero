/*eslint-disable*/
import { styled } from '@mui/material'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'

// function to search the rows of the grid
export const searchGrid = (
    searchQuery: string,
    allRows: any[],
    setFilteredRows: React.Dispatch<React.SetStateAction<any[]>>,
) => {
    const searchRegex = new RegExp(escapeRegExp(searchQuery), 'i')
    const filteredRows = allRows.filter((row: any) => {
        return Object.keys(row).some((field: string) => {
            if (field === 'borrowedAt' && row[field]) {
                return searchRegex.test(new Date(row[field]).toLocaleString())
            } else if (field === 'registered' && row[field]) {
                return searchRegex.test(new Date(row[field]).toLocaleDateString())
            }
            return searchRegex.test((row[field] || '').toString())
        })
    })
    setFilteredRows(filteredRows)
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
