// src/components/integrations/AdminToolsSection.tsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import AdminFeatureCard from './AdminFeatureCard';
import { AdminFeature } from './types';

interface AdminToolsSectionProps {
    features: AdminFeature[];
    onFeatureClick: (featureId: string) => void;
}

export default function AdminToolsSection({ features, onFeatureClick }: AdminToolsSectionProps) {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="medium">
                    Administrator Tools
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {features.map((feature) => (
                    <Grid item xs={12} sm={6} md={4} key={feature.id}>
                        <AdminFeatureCard
                            feature={feature}
                            onFeatureClick={onFeatureClick}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}