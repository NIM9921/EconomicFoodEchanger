// src/components/settings/AccountStatusSettings.tsx
import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert
} from '@mui/material';

interface AccountStatusSettingsProps {
    handleDeactivateAccount: () => void;
}

const AccountStatusSettings = ({ handleDeactivateAccount }: AccountStatusSettingsProps) => {
    const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);

    return (
        <Card>
            <CardHeader
                title="Account Status"
                subheader="Manage your account status"
            />
            <CardContent>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Deactivating your account will hide your profile and listings. You can reactivate at any time.
                </Alert>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setOpenDeactivateDialog(true)}
                >
                    Deactivate Account
                </Button>

                <Dialog
                    open={openDeactivateDialog}
                    onClose={() => setOpenDeactivateDialog(false)}
                    aria-labelledby="deactivate-dialog-title"
                >
                    <DialogTitle id="deactivate-dialog-title">
                        Deactivate Your Account?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to deactivate your account? This action will hide your profile and all your listings.
                            You can reactivate your account at any time by logging back in.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeactivateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeactivateAccount} color="error" autoFocus>
                            Deactivate
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default AccountStatusSettings;