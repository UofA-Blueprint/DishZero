/*eslint-disable*/
import { useEffect, useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import load = Simulate.load
import { Dish, DishStatus, DishStatusColors, DishType, DishTypeColors } from '../constants'
import { useAuth } from '../../contexts/AuthContext'
import adminApi from '../adminApi'
import { DataGrid, GridColDef, DataGridProps, GridRowId } from '@mui/x-data-grid'
import { useDemoData } from '@mui/x-data-grid-generator'
import { styled } from '@mui/material/styles'
import NoDishesOverlay from './NoDishesOverlay'
import CustomToolbar from './customToolbar'
import { Chip } from '@mui/material'

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
    const { currentUser, sessionToken } = useAuth()

    // const loadDataFromBackend = async function () {
    //     let dishData = []
    //     if (sessionToken) {
    //         dishData = await adminApi.getAllDishes(sessionToken)
    //     }
    //     setRows(dishData)
    // }

    // useEffect(() => {
    //     if (rows.length == 0) {
    //         // load the data again
    //         loadDataFromBackend()
    //     }
    // }, [])

    const columns: GridColDef[] = [
        { field: 'dishId', headerName: 'Dish Id', width: 200 },
        {
            field: 'dishType',
            headerName: 'Dish Type',
            width: 200,
            type: 'singleSelect',
            valueOptions: Object.values(DishType) as string[],
            renderCell(params) {
                return (
                    <>
                        {params && (
                            <Chip
                                variant="outlined"
                                sx={{
                                    color: `${DishTypeColors[params.formattedValue] ?? 'inherit'}`,
                                    border: `2px solid ${DishTypeColors[params.formattedValue] ?? 'inherit'}`,
                                }}
                                label={params.formattedValue}
                            />
                        )}
                    </>
                )
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 200,
            editable: true,
            type: 'singleSelect',
            valueOptions: Object.values(DishStatus) as string[],
            renderCell(params) {
                return (
                    <>
                        {params && (
                            <Chip
                                variant="outlined"
                                sx={{
                                    color: `${DishStatusColors[params.formattedValue] ?? 'inherit'}`,
                                    border: `2px solid ${DishStatusColors[params.formattedValue] ?? 'inherit'}`,
                                }}
                                label={params.formattedValue}
                            />
                        )}
                    </>
                )
            },
        },
        {
            field: 'overdue',
            headerName: 'Overdue',
            width: 200,
            renderCell(params) {
                return <>{params.row['status'] == DishStatus.OVERDUE && <>{params.formattedValue}</>}</>
            },
        },
        { field: 'timesBorrowed', headerName: 'Times Borrowed', width: 200 },
        {
            field: 'dateAdded',
            headerName: 'Date Added',
            width: 200,
            valueFormatter({ value }: { value: Date }) {
                return value.toDateString()
            },
            type: 'date',
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
                        toolbar: CustomToolbar,
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
