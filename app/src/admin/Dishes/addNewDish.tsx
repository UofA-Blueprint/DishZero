import {
    Box,
    DialogContent,
    Divider,
    FormControlLabel,
    IconButton,
    LinearProgress,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { StyledContainedButton, StyledOutlinedButton, capitalizeFirstLetter } from './constants'
import { AddCircleOutline, Close, HelpOutline } from '@mui/icons-material'
import adminApi from '../adminApi'
import { useAuth } from '../../contexts/AuthContext'
import CustomDialogTitle from '../CustomDialogTitle'
import AddNewDishTypeDialog from './addNewDishType'
import { closeSnackbar, useSnackbar } from 'notistack'
import UploadCSVDialog from './uploadCSVDialog'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    dishTypes: string[]
    fetchDishTypes: () => void // function to reload the dish types from the backend
    fetchDishes: () => void // function to reload the dishes from the backend
}

export const usePreventReload = (loading: boolean) => {
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (loading) {
                event.preventDefault()
                event.returnValue = ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [loading])
}

export default function AddNewDishDialog({ open, setOpen, dishTypes, fetchDishTypes, fetchDishes }: Props) {
    const { sessionToken } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const [addDishTypeDialogOpen, setAddDishTypeDialogOpen] = useState<boolean>(false)
    const [uploadCSVDialogOpen, setUploadCSVDialogOpen] = useState<boolean>(false)

    const [error, setError] = useState<boolean>(false) // dish type or id is not entered
    const [loading, setLoading] = useState<boolean>(false)

    const [dishTypeValue, setDishTypeValue] = useState<string>('') // dish type value selected by user
    const [dishIdValue, setDishIdValue] = useState<string>('') // dish id value entered by user

    const resetState = () => {
        setError(false)
        setDishTypeValue('')
        setDishIdValue('')
    }

    // prevent page reload when loading
    usePreventReload(loading)

    // if fields are filled out -> no longer show error
    useEffect(() => {
        if (dishTypeValue && dishIdValue && error) setError(false)
    }, [dishTypeValue, dishIdValue])

    const addDish = async () => {
        if (!dishTypeValue || !dishIdValue) {
            setError(true)
            return
        }

        // parse the dish ids
        let dishIdLower = -1,
            dishIdUpper = -1
        try {
            if (dishIdValue.includes('-')) {
                const splitDishIdString = dishIdValue.split('-')
                dishIdLower = parseInt(splitDishIdString[0].trim())
                dishIdUpper = parseInt(splitDishIdString[1].trim())
            } else {
                dishIdLower = dishIdUpper = parseInt(dishIdValue.trim())
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                // eslint-disable-next-line no-console
                console.error(`Failed to add dishes: ${error.message}`)
            } else {
                // eslint-disable-next-line no-console
                console.error(`An unexpected error occurred: ${JSON.stringify(error)}`)
            }
        }

        if (sessionToken) {
            setLoading(true)
            // eslint-disable-next-line no-console
            console.log('Adding dishes...', dishTypeValue, dishIdLower, dishIdUpper)
            const response = await adminApi.addDishes(sessionToken, dishTypeValue, dishIdLower, dishIdUpper)

            // eslint-disable-next-line no-console
            console.log('Response:', response)

            if (response && response.status != 200) {
                enqueueSnackbar('Failed to add dish(es): ' + response.message, { variant: 'error' })
            } else {
                setOpen(false)
                fetchDishes()
                resetState()
                const dishesAdded = dishIdUpper - dishIdLower + 1
                const existingDishes = Array.isArray(response.data.response.existingDishes)
                    ? response.data.response.existingDishes.length
                    : 0
                const addedNewDishes = dishesAdded - existingDishes
                enqueueSnackbar(
                    `${addedNewDishes ? 'Successfully added dish(es).' : 'No dishes added.'} ${
                        existingDishes > 0
                            ? `The following dishes already exist: ${response.data.response.existingDishes.join(', ')}`
                            : ''
                    }`,
                    {
                        variant: existingDishes ? 'warning' : 'success',
                        autoHideDuration: existingDishes ? null : 3000,
                        action: (key) => (
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={() => closeSnackbar(key)}>
                                <Close fontSize="small" />
                            </IconButton>
                        ),
                    },
                )
            }
            setLoading(false)
        }
    }

    return (
        <>
            <CustomDialogTitle
                open={open}
                setOpen={setOpen}
                dialogTitle={'Add New Dishes'}
                loading={loading}
                onCloseCallback={resetState}>
                <DialogContent sx={{ minWidth: '420px' }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: '1rem' }}>
                        Add manually
                    </Typography>
                    {'Dish Type:'}
                    <RadioGroup
                        row
                        aria-label="dish-types-radio-group"
                        name="dish-types-radio-group"
                        sx={{ mb: '1rem' }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setDishTypeValue(event.target.value)
                        }}>
                        {dishTypes.map((type) => (
                            <FormControlLabel
                                key={type}
                                disabled={loading}
                                value={type.toLowerCase()}
                                control={<Radio />}
                                label={capitalizeFirstLetter(type)}
                            />
                        ))}
                        <Tooltip title="Add a new dish type" arrow placement="top">
                            <IconButton
                                disabled={loading}
                                onClick={() => {
                                    setAddDishTypeDialogOpen(true)
                                }}
                                sx={{ color: 'secondary.main', alignSelf: 'center', cursor: 'pointer' }}>
                                <AddCircleOutline />
                            </IconButton>
                        </Tooltip>
                    </RadioGroup>

                    {'Dish ID:'}
                    <Box width="100%" sx={{ textAlign: 'center' }}>
                        <Box display="flex" width="100%" sx={{ verticalAlign: 'center', textAlign: 'center' }}>
                            <TextField
                                variant="outlined"
                                sx={{ width: '100%', mb: '0.25rem', mt: '0.25rem' }}
                                placeholder="Enter dish ids..."
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const newValue = event.target.value

                                    // only accept a number or a range of numbers
                                    if (newValue === '' || !/^(\d+(-\d+)?)$/.test(newValue)) {
                                        setError(true)
                                    } else {
                                        setError(false)
                                        setDishIdValue(newValue)
                                    }
                                }}
                                disabled={loading}
                                error={error}
                                helperText={error ? 'Must be a number or in the format number1-number2' : ''}
                            />

                            <Tooltip title="Add a single dish or a range of dishes e.g 100-200" placement="top" arrow>
                                <HelpOutline sx={{ m: '10px', verticalAlign: 'center', alignSelf: 'center' }} />
                            </Tooltip>
                        </Box>

                        <StyledContainedButton
                            variant="contained"
                            onClick={() => addDish()}
                            sx={{ width: '90%', mt: '1rem' }}
                            disabled={loading || error || dishTypeValue === '' || dishIdValue === ''}>
                            Add new dishes
                        </StyledContainedButton>
                    </Box>
                    <Divider>
                        <Typography variant="overline" sx={{ mb: '0.25rem' }}>
                            OR
                        </Typography>
                    </Divider>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: '1rem' }}>
                        Add from file
                    </Typography>
                    <Box width="100%" sx={{ textAlign: 'center' }}>
                        <StyledOutlinedButton
                            sx={{ width: '90%' }}
                            disabled={loading}
                            onClick={() => setUploadCSVDialogOpen(true)}>
                            Upload a CSV file
                        </StyledOutlinedButton>
                    </Box>
                    {loading && (
                        <LinearProgress
                            sx={{
                                mt: '15px',
                            }}
                        />
                    )}
                </DialogContent>
            </CustomDialogTitle>
            <AddNewDishTypeDialog
                open={addDishTypeDialogOpen}
                setOpen={setAddDishTypeDialogOpen}
                fetchDishTypes={fetchDishTypes}
            />
            <UploadCSVDialog open={uploadCSVDialogOpen} setOpen={setUploadCSVDialogOpen} fetchDishes={fetchDishes} />
        </>
    )
}
