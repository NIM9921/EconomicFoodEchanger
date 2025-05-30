// src/components/settings/PersonalDetailsSettings.tsx
import React from 'react';
import { Card, CardContent, Grid, TextField, Button } from '@mui/material';

interface PersonalDetailsProps {
    personalDetails: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    handlePersonalDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    savePersonalDetails: () => void;
}

const PersonalDetailsSettings = ({
                                     personalDetails,
                                     handlePersonalDetailsChange,
                                     savePersonalDetails
                                 }: PersonalDetailsProps) => {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={personalDetails.firstName}
                            onChange={handlePersonalDetailsChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={personalDetails.lastName}
                            onChange={handlePersonalDetailsChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={personalDetails.email}
                            onChange={handlePersonalDetailsChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={personalDetails.phone}
                            onChange={handlePersonalDetailsChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={savePersonalDetails}
                        >
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PersonalDetailsSettings;