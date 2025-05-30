
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Avatar,
    Typography
} from '@mui/material';

interface ConnectDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function ConnectDialog({ open, onClose }: ConnectDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Connect to Food Exchanger</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Avatar
                        src="https://img.freepik.com/free-vector/food-sharing-concept-illustration_114360-11739.jpg"
                        sx={{ width: 100, height: 100 }}
                        variant="rounded"
                    />
                </Box>
                <Typography variant="body1" paragraph>
                    You'll be redirected to the Economic Food Exchanger app to authorize the connection.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This integration allows you to share surplus food, reduce waste and participate in community food initiatives.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="success">Connect</Button>
            </DialogActions>
        </Dialog>
    );
}