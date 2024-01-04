/*eslint-disable*/
import { useEffect, useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import load = Simulate.load
import { Dish, DishStatus, DishType } from '../constants'
import { useAuth } from '../../contexts/AuthContext'
import adminApi from '../adminApi'
import { DataGrid, GridColDef, DataGridProps } from '@mui/x-data-grid'
import { useDemoData } from '@mui/x-data-grid-generator'
import { styled } from '@mui/material/styles'
import NoDishesOverlay from './NoDishesOverlay'

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

interface Props {
    rows: Dish[]
    setRows: React.Dispatch<React.SetStateAction<Dish[]>>
}

export default function AdminDishTable({ rows, setRows }: Props) {
    const [headerChecked, setHeaderChecked] = useState(false)
    const [selectedList, setSelectedList] = useState(Array(rows.length).fill(false))

    const [selectedCount, setSelectedCount] = useState(0)

    const { currentUser, sessionToken } = useAuth()

    const loadDataFromBackend = async function () {
        let dishData = []
        if (sessionToken) {
            dishData = await adminApi.getAllDishes(sessionToken)
        }
        setRows(dishData)
    }

    // useEffect(() => {
    //     if (rows.length == 0) {
    //         // load the data again
    //         loadDataFromBackend()
    //     }
    // }, [])

    // Handles the state change of the checkbox in table head
    const handleHeaderCheckChange = () => {
        const newHeaderVal = !headerChecked
        setHeaderChecked(newHeaderVal)
        if (newHeaderVal) {
            setSelectedList(Array(selectedList.length).fill(true))
        } else {
            setSelectedList(Array(selectedList.length).fill(false))
        }
    }

    const columns: GridColDef[] = [
        { field: 'dishId', headerName: 'Dish Id', width: 200 },
        {
            field: 'dishType',
            headerName: 'Dish Type',
            width: 200,
            type: 'singleSelect',
            valueOptions: Object.values(DishType) as string[],
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 200,
            editable: true,
            type: 'singleSelect',

            valueOptions: Object.values(DishStatus) as string[],
        },
        { field: 'overdue', headerName: 'Overdue', width: 200 },
        { field: 'timesBorrowed', headerName: 'Times Borrowed', width: 200 },
        {
            field: 'dateAdded',
            headerName: 'Date Added',
            width: 200,
            valueFormatter: ({ value }: { value: Date }) => {
                return value.toDateString()
            },
        },
    ]

    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100000,
        editable: true,
    })
    console.log(data)

    return (
        <>
            <div style={{ width: '100%' }}>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    slots={{
                        noRowsOverlay: NoDishesOverlay,
                        noResultsOverlay: NoDishesOverlay,
                    }}
                    slotProps={{
                        panel: {
                            placement: 'top-start',
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    autoHeight
                    checkboxSelection
                    getRowId={(row) => row.dishId}
                    experimentalFeatures={{ ariaV7: true }}
                />
            </div>
        </>
    )
}
