/*eslint-disable*/
import { useEffect, useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import load = Simulate.load
import { Dish, StyledContainedButton, StyledOutlinedButton, generateColumns } from './constants'
import { useAuth } from '../../contexts/AuthContext'
import adminApi from '../adminApi'
import CustomToolbar from '../DataGrid/customToolbar'
import { StyledDataGrid } from '../DataGrid/constants'
import NoResultsOverlay from '../DataGrid/noResultsOverlay'
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'
import { GridOverlay, GridRowId, GridRowModel } from '@mui/x-data-grid'
import React from 'react'
import { useSnackbar } from 'notistack'
import CustomDialogTitle from '../CustomDialogTitle'
import { BallTriangle } from 'react-loader-spinner'

interface Props {
    filteredRows: Dish[]
    dishTypes: string[]
    loadingDishes: boolean
    fetchDishes: () => void
}

export default function AdminDishesTable({ filteredRows, dishTypes, loadingDishes, fetchDishes }: Props) {
    const { sessionToken } = useAuth()
    const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
    const [open, setOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const handleDishDelete = async function () {
        if (sessionToken) {
            setDeleting(true)
            const response = await adminApi.deleteDishes(sessionToken, selectedRows)

            if (response && response.status != 200) {
                enqueueSnackbar(`Failed to delete dishes: ${response.status}`, { variant: 'error' })
            } else {
                setOpen(false)
                setSelectedRows([])
                enqueueSnackbar('Successfully deleted dishes', { variant: 'success' })
                fetchDishes()
            }
            setDeleting(false)
        }
    }

    // must return the rowobject to update the internal state -> therefore you can cancel
    // the update by returning the old row
    const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
        console.log('newRow', newRow)
        console.log('oldRow', oldRow)
        if (sessionToken) {
            console.log('Modifying dish...', newRow, oldRow)
            const response = await adminApi.modifyDish(sessionToken, newRow, oldRow)

            console.log('Response:', response)

            if (response && response.status != 200) {
                enqueueSnackbar('Failed to modify dish: ' + response.message, { variant: 'error' })
                return oldRow
            } else {
                enqueueSnackbar(`Successfully modified dish: ${newRow.qid}`, { variant: 'success' })
                return newRow
            }
        }
        return oldRow
    }

    const handleProcessRowUpdateError = React.useCallback((error: Error) => {
        console.error(error)
        enqueueSnackbar(`Row could not be updated with error: ${error.message}`, { variant: 'error' })
    }, [])

    return (
        <>
            <StyledDataGrid
                loading={loadingDishes}
                rows={filteredRows}
                columns={generateColumns(dishTypes)}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                sx={{ flex: 1, minWidth: 950, maxWidth: 1300 }}
                slots={{
                    loadingOverlay: () => (
                        <GridOverlay style={{ flexDirection: 'column', paddingTop: 10, paddingBottom: 10 }}>
                            <BallTriangle
                                height={80}
                                width={80}
                                radius={5}
                                color="#4fa94d"
                                ariaLabel="ball-triangle-loading"
                                visible={true}
                            />
                        </GridOverlay>
                    ),
                    noRowsOverlay: () => <NoResultsOverlay value={'Dishes'} />,
                    noResultsOverlay: () => <NoResultsOverlay value={'Dishes'} />,
                    toolbar: () => (
                        <CustomToolbar>
                            <Button disabled={selectedRows.length == 0} onClick={() => setOpen(true)} color="secondary">
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
                getRowId={(row) => row.qid}
                experimentalFeatures={{ ariaV7: true }}
                onRowSelectionModelChange={(newSelection) => {
                    setSelectedRows(newSelection)
                }}
            />
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
                    loading={deleting}>
                    <DialogContent sx={{ minWidth: '420px' }}>
                        <Box width="100%" sx={{ textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ color: (theme) => theme.palette.warning.main }}>
                                This cannot be undone!
                            </Typography>
                            <StyledContainedButton
                                variant="contained"
                                onClick={() => handleDishDelete()}
                                sx={{ width: '90%' }}
                                disabled={deleting}>
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
