// src/components/integrations/dialogs/UserManagementDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import TableBasedUserTable from '../../TableBasedUserTable';

interface UserManagementDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function UserManagementDialog({ open, onClose }: UserManagementDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            fullScreen
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                User Management
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TableBasedUserTable />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
}