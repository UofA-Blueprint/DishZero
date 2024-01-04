/*eslint-disable*/
import { Box, Dialog, DialogTitle, IconButton, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { Close } from '@mui/icons-material'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    dialogTitle: string
    loading: boolean
    children: ReactNode
}

export default function CustomDialogTitle({ open, setOpen, dialogTitle, loading, children }: Props) {
    // TODO use formik to prevent page reload? or is there a way to set this?
    return (
        <Dialog
            open={open}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '20px',
                },
            }}>
            <DialogTitle>
                <Box display="flex" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ width: '90%', textAlign: 'center' }}>
                        {dialogTitle}
                    </Typography>
                    <IconButton onClick={() => setOpen(false)} disabled={loading}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            {children}
        </Dialog>
    )
}
