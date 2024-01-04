/*eslint-disable*/
import { useEffect, useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import load = Simulate.load
import { Dish, StyledContainedButton, StyledOutlinedButton } from './constants'
import { useAuth } from '../../contexts/AuthContext'
import adminApi from '../adminApi'
import CustomToolbar from '../DataGrid/customToolbar'
import { StyledDataGrid } from '../DataGrid/constants'
import { columns } from './constants'
import NoResultsOverlay from '../DataGrid/noResultsOverlay'
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'
import { GridCellEditStopParams, GridRowId, GridRowModel } from '@mui/x-data-grid'
import React from 'react'
import { useSnackbar } from 'notistack'
import CustomDialogTitle from '../CustomDialogTitle'

interface Props {
    rows: Dish[]
    setRows: React.Dispatch<React.SetStateAction<Dish[]>>
}

export default function AdminDishesTable({ rows, setRows }: Props) {
    const { currentUser, sessionToken } = useAuth()
    const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const loadDataFromBackend = async function () {
        let dishData = []
        if (sessionToken) {
            dishData = await adminApi.getAllDishes(sessionToken)
        }
        // setRows(dishData)
    }

    useEffect(() => {
        if (rows.length == 0) {
            // load the data again
            // loadDataFromBackend()
        }
    }, [])

    const handleDishDelete = async function () {
        if (sessionToken) {
            setLoading(true)
            const response = await adminApi.deleteDishes(sessionToken, selectedRows)
            console.log('Response:', response)

            if (response && response.status != 200) {
                enqueueSnackbar(`Failed to delete dishes: ${response.status}`, { variant: 'error' })
            } else {
                // TODO: fetch the dish types from the db? or just the loadDataFromBackend()
                // loadDataFromBackend()
                setOpen(false)
                setSelectedRows([])
                enqueueSnackbar('Successfully delete dishes', { variant: 'success' })
            }
            setLoading(false)
        }
    }

    const handleDishStatusChange = async (params: GridCellEditStopParams, event?: any) => {
        console.log('paras', params)
        console.log('events', event)

        const dishId = params.row.dishId // The dish id
        const newValue = params.formattedValue as string // The new value of the cell?
        const field = params.field // The field of the column that contains the cell

        // TODO: it would be nice to get the previous cell value to check whether
        // the status was change externally

        // ensure that the status field wa change
        if (field == 'status' && sessionToken) {
            await adminApi.modifyDishStatus(sessionToken, dishId, newValue)

            // TODO: reload data from backend? but it should match right?
            //loadDataFromBackend()
        }
    }
    // must return the rowobject to update the internal state -> therefore you can cancel
    // the update by returning the old row
    const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
        // Make the HTTP request to save in the backend
        // const response = await mutateRow(newRow)

        // TODO this should only be for the status? should we just have a common api to update the whole row??
        // const response = await adminApi.modifyDish(sessionToken, newRod, oldRow)
        // const response = await modifyDishStatus(sessionToken, dishId, newValue, oldValue)
        console.log('new row', newRow)
        console.log('old row', oldRow)
        enqueueSnackbar('Status successfully saved', { variant: 'success' })
        //return response
        // Server-side validation
        /* If you need to cancel the save process on processRowUpdate—for instance, when a database validation fails, or the user wants to reject the changes—there are two options:

            Reject the promise so that the internal state is not updated and the cell remains in edit mode.
            Resolve the promise with the second argument (original row before editing), so that the internal state is not updated, and the cell exits edit mode.
            The following demo implements the first option: rejecting the promise. Instead of validating while typing, it simulates validation on the server. 
            If the new name is empty, the promise responsible for saving the row will be rejected, and the cell will remain in edit mode.
        */
        return newRow
    }

    const handleProcessRowUpdateError = React.useCallback((error: Error) => {
        console.error(error)
        enqueueSnackbar(`Status could not be saved with error: ${error.message}`, { variant: 'error' })
    }, [])

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
                        toolbar: () => (
                            <CustomToolbar>
                                <Button
                                    disabled={selectedRows.length == 0}
                                    onClick={() => setOpen(true)}
                                    color="secondary">
                                    Delete {selectedRows.length} {selectedRows.length == 1 ? 'dish' : 'dishes'}
                                </Button>
                            </CustomToolbar>
                        ),
                    }}
                    slotProps={{
                        panel: {
                            placement: 'auto-start',
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    autoHeight
                    checkboxSelection
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    getRowId={(row) => row.dishId}
                    experimentalFeatures={{ ariaV7: true }}
                    onRowSelectionModelChange={(newSelection) => {
                        setSelectedRows(newSelection)
                    }}
                />
            </div>
            <Dialog
                open={open}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '20px',
                    },
                }}>
                <CustomDialogTitle
                    open={open}
                    setOpen={setOpen}
                    dialogTitle={`Confirm deletion of ${selectedRows.length} ${
                        selectedRows.length == 1 ? 'dish' : 'dishes'
                    } `}
                    loading={loading}>
                    <DialogContent sx={{ minWidth: '420px' }}>
                        <Box width="100%" sx={{ textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ color: (theme) => theme.palette.warning.main }}>
                                This cannot be undone!
                            </Typography>
                            <StyledContainedButton
                                variant="contained"
                                onClick={() => handleDishDelete()}
                                sx={{ width: '90%' }}
                                disabled={loading}>
                                Delete
                            </StyledContainedButton>
                            <StyledOutlinedButton sx={{ width: '90%' }} onClick={() => setOpen(false)}>
                                Exit
                            </StyledOutlinedButton>
                        </Box>
                    </DialogContent>
                </CustomDialogTitle>
            </Dialog>
        </>
    )
}
