// src/components/settings/SecuritySettings.tsx
import React from 'react';
import { Card, CardContent, Grid, TextField, Button } from '@mui/material';

interface SecuritySettingsProps {
    passwordForm: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    savePassword: () => void;
}

const SecuritySettings = ({
                              passwordForm,
                              handlePasswordChange,
                              savePassword
                          }: SecuritySettingsProps) => {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={savePassword}
                        >
                            Change Password
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default SecuritySettings;