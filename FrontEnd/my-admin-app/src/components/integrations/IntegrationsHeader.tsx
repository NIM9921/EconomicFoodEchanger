// src/components/integrations/IntegrationsHeader.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';

export default function IntegrationsHeader() {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ fontSize: 38, mr: 2, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Integrations
                </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
                Connect with content creation tools and manage your Food Exchange platform.
            </Typography>
        </>
    );
}