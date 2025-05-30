// src/components/VegitablePost.tsx
import React, { useState } from 'react';
import {
    Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography,
    Box, ImageList, ImageListItem, ImageListItemBar, Chip, useMediaQuery, useTheme
} from '@mui/material';
import { ThumbUp, ChatBubble, Share, StarBorder as StarBorderIcon } from '@mui/icons-material';
import Button from '@mui/material/Button';
import ScrollDialog from './DealDetails';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Define the props interface
export interface VegitablePostProps {
    title: string;
    user: string;
    userAvatar?: string;
    timestamp: string;
    content: string;
    tags: string[];
    category: 'buying' | 'selling';
    images: {
        img: string;
        title: string;
        featured?: boolean;
    }[];
    likes?: number;
    comments?: number;
}

const VegitablePost: React.FC<VegitablePostProps> = ({
                                                         title,
                                                         user,
                                                         userAvatar,
                                                         timestamp,
                                                         content,
                                                         tags,
                                                         category,
                                                         images,
                                                         likes = 15,
                                                         comments = 3
                                                     }) => {
    const [liked, setLiked] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <>
            <Card sx={{
                mb: 2,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: `1px solid ${category === 'buying' ? '#3f51b5' : '#4caf50'}`,
                '&:hover': {
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                    transform: 'translateY(-3px)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }
            }}>
                {/* Category indicator bar */}
                <Box sx={{
                    height: '4px',
                    backgroundColor: category === 'buying' ? '#3f51b5' : '#4caf50',
                    width: '100%'
                }} />

                <CardHeader
                    avatar={
                        <Avatar
                            src={userAvatar || "https://via.placeholder.com/150"}
                            sx={{
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 }
                            }}
                        />
                    }
                    action={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={category === 'buying' ? 'BUYING' : 'SELLING'}
                                color={category === 'buying' ? 'primary' : 'success'}
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => setShowDialog(true)}
                                size="small"
                                sx={{ ml: 1 }}
                            >
                                <i className="fa-solid fa-handshake" style={{color: "#ffffff"}}></i>
                                &nbsp;Deal
                            </Button>
                        </Box>
                    }
                    title={
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'left' }}>
                            {user}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption" color="text.secondary" sx={{
                            mb: 1,
                            textAlign: 'left',
                            display: 'block',
                            width: '100%'
                        }}>
                            {timestamp}
                        </Typography>
                    }
                    sx={{
                        padding: { xs: 2, sm: 2.5 },
                        '.MuiCardHeader-content': {
                            textAlign: 'left',
                            width: '100%'
                        }
                    }}
                />

                <CardContent sx={{ padding: { xs: '0 16px', sm: '0 24px' }, pb: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left' }}>
                        {content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        {tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={`#${tag}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    bgcolor: 'rgba(240, 247, 235, 0.8)',
                                    borderColor: category === 'buying' ? '#3f51b5' : '#4caf50'
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>

                {/* Image Gallery */}
                {images.length > 0 && (
                    <ImageList
                        sx={{
                            width: '100%',
                            margin: 0,
                            padding: { xs: '0 16px', sm: '0 24px' }
                        }}
                        cols={isMobile ? 1 : 2}
                        rowHeight={isMobile ? 240 : 200}
                        gap={8}
                    >
                        {images.map((item, index) => (
                            <ImageListItem
                                key={index}
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                                cols={item.featured && !isMobile ? 2 : 1}
                                rows={item.featured && !isMobile ? 2 : 1}
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                <ImageListItemBar
                                    title={item.title}
                                    actionIcon={
                                        <IconButton sx={{ color: 'white' }}>
                                            <StarBorderIcon />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}

                <CardActions
                    disableSpacing
                    sx={{
                        padding: { xs: '8px 16px', sm: '12px 24px' },
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <Box sx={{ display: 'flex' }}>
                        <IconButton
                            onClick={toggleLike}
                            color={liked ? 'primary' : 'default'}
                        >
                            <ThumbUp fontSize="small" />
                        </IconButton>
                        <IconButton>
                            <ChatBubble fontSize="small" />
                        </IconButton>
                        <IconButton>
                            <Share fontSize="small" />
                        </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {likes} likes • {comments} comments
                    </Typography>
                </CardActions>
            </Card>

            {showDialog && <ScrollDialog open={showDialog} onClose={() => setShowDialog(false)} />}
        </>
    );
};

export default VegitablePost;