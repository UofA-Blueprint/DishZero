/*eslint-disable*/
import { useEffect, useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import load = Simulate.load
import { Dish } from './constants'
import { useAuth } from '../../contexts/AuthContext'
import adminApi from '../adminApi'
import CustomToolbar from '../DataGrid/customToolbar'
import { StyledDataGrid } from '../DataGrid/constants'
import { columns } from './constants'
import NoResultsOverlay from '../DataGrid/noResultsOverlay'

interface Props {
    rows: Dish[]
    setRows: React.Dispatch<React.SetStateAction<Dish[]>>
}

export default function AdminDishesTable({ rows, setRows }: Props) {
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

    return (
        <>
            <div style={{ width: '100%' }}>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 15 },
                        },
                    }}
                    slots={{
                        noRowsOverlay: () => <NoResultsOverlay value={'Dishes'} />,
                        noResultsOverlay: () => <NoResultsOverlay value={'Dishes'} />,
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
