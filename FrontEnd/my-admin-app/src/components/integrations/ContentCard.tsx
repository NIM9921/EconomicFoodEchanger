// src/components/integrations/ContentCard.tsx
import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    Button,
    Box
} from '@mui/material';
import {
    Fastfood as FastfoodIcon,
    PostAdd as PostAddIcon,
    Share as ShareIcon,
    Add as AddIcon,
    Sync as SyncIcon
} from '@mui/icons-material';
import { ContentCardProps } from './types';

export default function ContentCard({
                                        title,
                                        subheader,
                                        description,
                                        icon,
                                        color,
                                        buttonText,
                                        buttonColor = "primary",
                                        onClick
                                    }: ContentCardProps) {
    // Select the appropriate icon based on the icon string
    const getIcon = () => {
        switch (icon) {
            case 'fastfood': return <FastfoodIcon />;
            case 'postadd': return <PostAddIcon />;
            case 'share': return <ShareIcon />;
            default: return <FastfoodIcon />;
        }
    };

    // Select the appropriate button icon
    const getButtonIcon = () => {
        if (buttonText.includes("Connect")) return <SyncIcon />;
        return <AddIcon />;
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
                    bgcolor: color,
                    color: 'white',
                    py: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {React.cloneElement(getIcon(), { sx: { fontSize: 64 } })}
            </Box>
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: color }}>{getIcon()}</Avatar>}
                title={title}
                subheader={subheader}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    startIcon={getButtonIcon()}
                    variant="contained"
                    color={buttonColor}
                    fullWidth
                    onClick={onClick}
                >
                    {buttonText}
                </Button>
            </CardActions>
        </Card>
    );
}