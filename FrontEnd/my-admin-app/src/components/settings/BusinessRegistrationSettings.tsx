// src/components/settings/BusinessRegistrationSettings.tsx
import React from 'react';
import { Card, CardHeader, CardContent, Grid, TextField, Button, Alert } from '@mui/material';

interface BusinessRegistrationSettingsProps {
    businessRegistration: {
        brNumber: string;
        companyName: string;
        registrationDate: string;
        isVerified: boolean;
    };
    handleBRChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    submitBRVerification: () => void;
}

const BusinessRegistrationSettings = ({
                                          businessRegistration,
                                          handleBRChange,
                                          submitBRVerification
                                      }: BusinessRegistrationSettingsProps) => {
    return (
        <Card>
            <CardHeader
                title="Seller Business Registration"
                subheader={businessRegistration.isVerified ?
                    "Your business is verified" :
                    "Submit your business details for verification"}
            />
            <CardContent>
                {businessRegistration.isVerified && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Your business registration has been verified
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="BR Number"
                            name="brNumber"
                            value={businessRegistration.brNumber}
                            onChange={handleBRChange}
                            disabled={businessRegistration.isVerified}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Company Name"
                            name="companyName"
                            value={businessRegistration.companyName}
                            onChange={handleBRChange}
                            disabled={businessRegistration.isVerified}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Registration Date"
                            name="registrationDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={businessRegistration.registrationDate}
                            onChange={handleBRChange}
                            disabled={businessRegistration.isVerified}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            component="label"
                            disabled={businessRegistration.isVerified}
                        >
                            Upload BR Certificate
                            <input
                                type="file"
                                hidden
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitBRVerification}
                            disabled={businessRegistration.isVerified}
                        >
                            Submit for Verification
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default BusinessRegistrationSettings;