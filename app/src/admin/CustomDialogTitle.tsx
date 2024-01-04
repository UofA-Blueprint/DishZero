import { Box, Dialog, DialogTitle, IconButton, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { Close } from '@mui/icons-material'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    dialogTitle: string
    loading: boolean
    children: ReactNode
    onCloseCallback?: () => void // called when the dialog is being closed
}

export default function CustomDialogTitle({ open, setOpen, dialogTitle, loading, children, onCloseCallback }: Props) {
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
                    <IconButton
                        onClick={() => {
                            setOpen(false)
                            onCloseCallback && onCloseCallback()
                        }}
                        disabled={loading}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            {children}
        </Dialog>
    )
}
