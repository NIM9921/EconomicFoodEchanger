// src/components/integrations/ContentCreationSection.tsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { EditNote as EditNoteIcon } from '@mui/icons-material';
import ContentCard from './ContentCard';

interface ContentCreationSectionProps {
    onOpenDialog: (dialogId: string) => void;
}

export default function ContentCreationSection({ onOpenDialog }: ContentCreationSectionProps) {
    const contentItems = [
        {
            title: "Create New Post",
            subheader: "Share updates with your network",
            description: "Create engaging content about food offers, recipes, or special deals to share with your customers.",
            icon: "postadd",
            color: "primary.main",
            buttonText: "Create Post",
            buttonColor: "primary",
            onClick: () => onOpenDialog('post')
        },
        {
            title: "Create Story",
            subheader: "Highlight temporary offers",
            description: "Create time-limited stories to showcase flash sales, limited stock items or today's special menu items.",
            icon: "share",
            color: "secondary.main",
            buttonText: "Create Story",
            buttonColor: "secondary",
            onClick: () => onOpenDialog('story')
        },
        {
            title: "Economic Food Exchanger",
            subheader: "Connect with sustainable food networks",
            description: "Link your account with the Economic Food Exchanger app to participate in food rescue and sustainability initiatives.",
            icon: "fastfood",
            color: "success.main",
            buttonText: "Connect Customer Care",
            buttonColor: "success",
            onClick: () => onOpenDialog('connect')
        }
    ];

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 2 }}>
                <EditNoteIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="medium">
                    Content Creation
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {contentItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <ContentCard {...item} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}