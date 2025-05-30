// src/components/integrations/AdminFeatureCard.tsx
import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    Button,
    Badge,
    Box
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Analytics as AnalyticsIcon,
    EditNote as EditNoteIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import { AdminFeature } from './types';

interface AdminFeatureCardProps {
    feature: AdminFeature;
    onFeatureClick: (featureId: string) => void;
}

export default function AdminFeatureCard({ feature, onFeatureClick }: AdminFeatureCardProps) {
    const getIcon = () => {
        switch (feature.icon) {
            case 'admin': return <AdminIcon />;
            case 'analytics': return <AnalyticsIcon />;
            case 'editnote': return <EditNoteIcon />;
            default: return <AdminIcon />;
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <Box
                sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    py: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                {React.cloneElement(getIcon(), { sx: { fontSize: 64 } })}
                {feature.id === 'content' && (
                    <Badge
                        badgeContent={4}
                        color="secondary"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16
                        }}
                    >
                        <Box />
                    </Badge>
                )}
            </Box>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'error.main' }}>{getIcon()}</Avatar>}
                title={feature.name}
                action={
                    <Badge badgeContent={feature.id === 'content' ? 4 : 0} color="error">
                        <NotificationsIcon />
                    </Badge>
                }
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2">
                    {feature.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => onFeatureClick(feature.id)}
                >
                    Access
                </Button>
            </CardActions>
        </Card>
    );
}