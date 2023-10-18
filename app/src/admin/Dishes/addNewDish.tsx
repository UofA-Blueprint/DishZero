/*eslint-disable*/
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { StyledContainedButton, StyledOutlinedButton } from './constants'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
}

export default function AddNewDishDialog({ open, setOpen }: Props) {
    const [dishTypes, setDishTypes] = useState<string[]>([])

    useEffect(() => {
        setDishTypes(['Mug', 'Dish'])
    }, [])
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '20px',
                },
            }}>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Add New Dish</DialogTitle>
            <DialogContent sx={{ minWidth: '420px' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: '1rem' }}>
                    Add a single dish
                </Typography>
                {'Dish Type:'}
                <RadioGroup row aria-label="dish-types-radio-group" name="dish-types-radio-group" sx={{ mb: '1rem' }}>
                    {dishTypes.map((type) => (
                        <FormControlLabel value={type} control={<Radio />} label={type} />
                    ))}
                </RadioGroup>
                {'Dish ID:'}
                <Box width="100%" sx={{ textAlign: 'center' }}>
                    <TextField
                        variant="outlined"
                        sx={{ width: '100%', mb: '1rem', mt: '0.25rem' }}
                        placeholder="Enter dish id..."
                    />
                    <StyledContainedButton variant="contained" onClick={() => setOpen(true)} sx={{ width: '90%' }}>
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
                    <StyledOutlinedButton sx={{ width: '90%' }}>Upload a CSV file</StyledOutlinedButton>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
