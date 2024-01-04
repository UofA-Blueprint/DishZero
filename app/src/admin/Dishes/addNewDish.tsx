/*eslint-disable*/
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
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
import { useEffect, useRef, useState } from 'react'
import { DISHZERO_COLOR, DISHZERO_COLOR_LIGHT, StyledContainedButton, StyledOutlinedButton } from './constants'
import { AddCircleOutline, Close, HelpOutline } from '@mui/icons-material'
import adminApi from '../adminApi'
import { useAuth } from '../../contexts/AuthContext'
import CustomDialogTitle from '../CustomDialogTitle'
import AddNewDishTypeDialog from './addNewDishType'
import { useSnackbar } from 'notistack'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
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

export default function AddNewDishDialog({ open, setOpen }: Props) {
    const [addDishTypeOpen, setAddDishTypeOpen] = useState<boolean>(false)
    const [dishTypes, setDishTypes] = useState<string[]>([])
    const { sessionToken } = useAuth()
    const [error, setError] = useState<boolean>(false) // dish type or id is not entered
    const [loading, setLoading] = useState<boolean>(false)

    const [dishType, setDishType] = useState<string>('') // the dish type selected by user
    const [dishIdString, setDishIdString] = useState<string>('') // dish ids entered by user

    const { enqueueSnackbar } = useSnackbar()

    const loadDishTypesFromBackend = async function () {
        let dishTypes = []
        if (sessionToken) {
            dishTypes = await adminApi.getDishTypes(sessionToken)
        }
        console.log('dishTypes', dishTypes)
        // setRows(dishData)
    }

    useEffect(() => {
        loadDishTypesFromBackend()
        setDishTypes(['Mug', 'Dish'])
    }, [])

    // TODO incorporate this into the title close button?
    // reset on close/open
    useEffect(() => {
        setError(false)
        setDishType('')
        setDishIdString('')
    }, [open])

    // prevent page reload when loading
    usePreventReload(loading)

    // if fields are filled out -> no longer show error
    useEffect(() => {
        if (dishType && dishIdString && error) setError(false)
    }, [dishType, dishIdString])

    const addDish = async () => {
        if (!dishType || !dishIdString) {
            setError(true)
            return
        }

        // parse the dish ids
        let dishIdLower = -1,
            dishIdUpper = -1
        try {
            if (dishIdString.includes('-')) {
                const splitDishIdString = dishIdString.split('-')
                dishIdLower = parseInt(splitDishIdString[0].trim())
                dishIdUpper = parseInt(splitDishIdString[1].trim())
            } else {
                dishIdLower = dishIdUpper = parseInt(dishIdString.trim())
            }
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error(`Failed to parse dish ids ${error}.`)
            setError(true)
        }

        // setLoading(true)
        if (sessionToken) {
            setLoading(true)
            const response = await adminApi.addDishes(sessionToken, dishType, dishIdLower, dishIdUpper)

            console.log('Response:', response)

            if (response && response.status != 200) {
                enqueueSnackbar('Failed to add dish(es): ' + response.status, { variant: 'error' })
            } else {
                // TODO: fetch the dish types from the db? or just the loadDataFromBackend()
                // loadDataFromBackend()
                setOpen(false)
                setDishIdString('')
                setDishType('')
                enqueueSnackbar('Successfully added dish(es)', { variant: 'success' })
            }
            setLoading(false)
        }
    }

    return (
        <>
            <CustomDialogTitle open={open} setOpen={setOpen} dialogTitle={'Add New Dish'} loading={loading}>
                <DialogContent sx={{ minWidth: '420px' }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: '1rem' }}>
                        Add a single dish
                    </Typography>
                    {'Dish Type:'}
                    <RadioGroup
                        row
                        aria-label="dish-types-radio-group"
                        name="dish-types-radio-group"
                        sx={{ mb: '1rem' }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setDishType(event.target.value)
                        }}>
                        {dishTypes.map((type) => (
                            <FormControlLabel
                                key={type}
                                disabled={loading}
                                value={type}
                                control={<Radio />}
                                label={type}
                            />
                        ))}
                        <Tooltip title="Add a new dish type" arrow placement="top">
                            <IconButton
                                disabled={loading}
                                onClick={() => {
                                    setAddDishTypeOpen(true)
                                }}
                                // sx={{ color: DISHZERO_COLOR, alignSelf: 'center', cursor: 'pointer' }}>
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
                                        setDishIdString(newValue)
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
                            disabled={loading || error || dishType === '' || dishIdString === ''}>
                            Add new dish
                        </StyledContainedButton>
                    </Box>
                    <Divider>
                        <Typography variant="overline" sx={{ mb: '0.25rem' }}>
                            OR
                        </Typography>
                    </Divider>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: '1rem' }}>
                        Add multiple dishes
                    </Typography>
                    <Box width="100%" sx={{ textAlign: 'center' }}>
                        <StyledOutlinedButton sx={{ width: '90%' }} disabled={loading}>
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
            <AddNewDishTypeDialog open={addDishTypeOpen} setOpen={setAddDishTypeOpen} />
        </>
    )
}
