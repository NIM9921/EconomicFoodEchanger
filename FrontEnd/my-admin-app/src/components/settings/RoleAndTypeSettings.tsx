// src/components/settings/RoleAndTypeSettings.tsx
import React from 'react';
import { Grid, Card, CardHeader, CardContent, FormControl, InputLabel, Select, MenuItem, Box, Button, SelectChangeEvent } from '@mui/material';

interface RoleAndTypeSettingsProps {
    role: string;
    accountType: string;
    setRole: (role: string) => void;
    setAccountType: (type: string) => void;
    saveRole: () => void;
    saveAccountType: () => void;
}

const RoleAndTypeSettings = ({
                                 role,
                                 accountType,
                                 setRole,
                                 setAccountType,
                                 saveRole,
                                 saveAccountType
                             }: RoleAndTypeSettingsProps) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader title="Define Role" />
                    <CardContent>
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                id="role-select"
                                value={role}
                                label="Role"
                                onChange={(e: SelectChangeEvent) => setRole(e.target.value as string)}
                            >
                                <MenuItem value="user">Farmer</MenuItem>
                                <MenuItem value="admin">Whole sale seller</MenuItem>
                                <MenuItem value="moderator">retail seller</MenuItem>
                                <MenuItem value="moderator">home seller</MenuItem>
                                <MenuItem value="moderator">consumer</MenuItem>
                                <MenuItem value="moderator">Agriculture research officer</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveRole}
                            >
                                Update Role
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader title="Change Account Type" />
                    <CardContent>
                        <FormControl fullWidth>
                            <InputLabel id="account-type-select-label">Account Type</InputLabel>
                            <Select
                                labelId="account-type-select-label"
                                id="account-type-select"
                                value={accountType}
                                label="Account Type"
                                onChange={(e: SelectChangeEvent) => setAccountType(e.target.value as string)}
                            >
                                <MenuItem value="buyer">Buyer</MenuItem>
                                <MenuItem value="seller">Seller</MenuItem>
                                <MenuItem value="both">Both (Buyer & Seller)</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveAccountType}
                            >
                                Update Account Type
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default RoleAndTypeSettings;