// src/components/settings/AgreementsSettings.tsx
import React from 'react';
import { Grid, Card, CardHeader, CardContent, Typography, Button, FormControlLabel, Switch } from '@mui/material';

const AgreementsSettings = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Media Credential Agreement" />
                    <CardContent>
                        <Typography variant="body1" paragraph>
                            This agreement outlines the terms and conditions for using media credentials
                            on our platform. By accepting this agreement, you acknowledge the responsibilities
                            and limitations regarding content usage, sharing, and attribution.
                        </Typography>
                        <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="I accept the Media Credential Agreement"
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardHeader title="User Agreement" />
                    <CardContent>
                        <Typography variant="body1" paragraph>
                            The user agreement details your rights and responsibilities as a user of our platform.
                            This includes rules about account usage, content posting, and interactions with other users.
                        </Typography>
                        <Button variant="outlined" color="primary">
                            View Full Agreement
                        </Button>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardHeader title="User Manual" />
                    <CardContent>
                        <Typography variant="body1" paragraph>
                            Access comprehensive documentation on how to use all features of the platform.
                            The user manual includes step-by-step guides, FAQs, and troubleshooting tips.
                        </Typography>
                        <Button variant="outlined" color="primary">
                            Download User Manual
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AgreementsSettings;