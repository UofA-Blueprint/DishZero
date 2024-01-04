/*eslint-disable*/
import { Box, DialogContent, LinearProgress, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { DISHZERO_COLOR, DISHZERO_COLOR_LIGHT, StyledContainedButton } from './constants'
import adminApi from '../adminApi'
import { useAuth } from '../../contexts/AuthContext'
import CustomDialogTitle from '../CustomDialogTitle'
import { usePreventReload } from './addNewDish'
import { useSnackbar } from 'notistack'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    loading?: boolean
    setLoading?: (loading: boolean) => void
}

export default function AddNewDishTypeDialog({ open, setOpen }: Props) {
    const { sessionToken } = useAuth()

    const [error, setError] = useState<boolean>(false) // dish type or id is not entered
    const [loading, setLoading] = useState<boolean>(false)
    const [newDishType, setNewDishType] = useState<string>('')

    console.log('newDishType', newDishType)

    const { enqueueSnackbar } = useSnackbar()

    // prevent page reload when loading
    usePreventReload(loading)

    // reset error when dialog is opened/closed
    // TODO incorporate this into the close button?
    useEffect(() => {
        setError(false)
        setNewDishType('')
    }, [open])

    const addNewDishType = useCallback(async () => {
        if (newDishType === '') {
            setError(true)
            return
        }

        if (sessionToken) {
            setLoading(true)
            const response = await adminApi.addDishType(sessionToken, newDishType)
            console.log('Response:', response)

            if (response && response.status != 200) {
                enqueueSnackbar(`Failed to add dish type: ${response.status}`, { variant: 'error' })
            } else {
                // TODO: fetch the dish types from the db? or just the loadDataFromBackend()
                // loadDataFromBackend()
                setOpen(false)
                setNewDishType('')
                enqueueSnackbar('Successfully added dish type', { variant: 'success' })
            }
            setLoading(false)
        }
    }, [newDishType, sessionToken])
    return (
        <CustomDialogTitle open={open} setOpen={setOpen} dialogTitle={'Add New Dish Type'} loading={loading}>
            <DialogContent sx={{ minWidth: '520px', maxWidth: '520px' }}>
                <Box width="100%" sx={{ textAlign: 'center' }}>
                    <TextField
                        variant="outlined"
                        sx={{ width: '100%', mb: '0.25rem', mt: '0.25rem' }}
                        placeholder="Enter dish type..."
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const newValue = event.target.value

                            // only accept letters
                            if (newValue === '' || /[^a-zA-Z]/.test(newValue)) {
                                setError(true)
                            } else {
                                setError(false)
                                setNewDishType(newValue)
                            }
                        }}
                        disabled={loading}
                        error={error}
                        helperText={error ? 'Cannot be empty or contain numbers & special characters' : ' '}
                    />
                    <StyledContainedButton
                        variant="contained"
                        onClick={() => addNewDishType()}
                        sx={{ width: '90%', mt: '1rem' }}
                        disabled={loading || error || newDishType == ''}>
                        Add new dish type
                    </StyledContainedButton>
                </Box>
                {loading && (
                    <LinearProgress
                        sx={{
                            mt: '15px',
                            backgroundColor: DISHZERO_COLOR_LIGHT,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: DISHZERO_COLOR,
                            },
                        }}
                    />
                )}
            </DialogContent>
        </CustomDialogTitle>
    )
}
