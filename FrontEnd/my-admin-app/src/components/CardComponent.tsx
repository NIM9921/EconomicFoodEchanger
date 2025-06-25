import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActionArea,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Avatar,
    Chip,
    MobileStepper,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Snackbar,
    Alert as MuiAlert
} from '@mui/material';
import {
    Close as CloseIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Fullscreen as FullscreenIcon,
    Share as ShareIcon,
    WhatsApp as WhatsAppIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    Telegram as TelegramIcon,
    Email as EmailIcon,
    Link as LinkIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

// Create auto-play swipeable views
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface VegitableStoryCardProps {
    title: string;
    content: string;
    user: string;
    photo: string;
    // Add optional props for enhanced functionality
    photos?: string[]; // Multiple photos for slider
    timestamp?: string; // Story creation time
    userAvatar?: string; // User profile image
    category?: string; // Story category
}

export default function VegitableStoryCard({ 
    title, 
    content, 
    user, 
    photo, 
    photos = [photo], // Default to single photo if photos array not provided
    timestamp,
    userAvatar,
    category 
}: VegitableStoryCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [autoPlayActive, setAutoPlayActive] = useState(true);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Ensure we have at least one photo
    const displayPhotos = photos.length > 0 ? photos : [photo];
    const maxSteps = displayPhotos.length;

    const handleCardClick = () => {
        setDialogOpen(true);
        setActiveStep(0); // Reset to first image when opening
        setAutoPlayActive(true); // Start auto-play
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setAutoPlayActive(false); // Stop auto-play when closing
    };

    const handleNext = () => {
        setAutoPlayActive(false); // Stop auto-play on manual navigation
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };

    const handleBack = () => {
        setAutoPlayActive(false); // Stop auto-play on manual navigation
        setActiveStep((prevActiveStep) => 
            prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
        );
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    // Format timestamp for display
    const formatTimestamp = (timestamp: string): string => {
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                if (diffInHours < 1) {
                    const diffInMinutes = Math.floor(diffInHours * 60);
                    return `${diffInMinutes}m ago`;
                }
                return `${Math.floor(diffInHours)}h ago`;
            } else if (diffInHours < 48) {
                return 'Yesterday';
            } else {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
            }
        } catch (e) {
            return '';
        }
    };

    // Get user avatar with fallback
    const getUserAvatar = () => {
        if (userAvatar) {
            if (userAvatar.startsWith('data:image')) {
                return userAvatar;
            }
            return `data:image/jpeg;base64,${userAvatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=4caf50&color=white&size=128`;
    };

    // Add social sharing state
    const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Social sharing functions
    const getShareUrl = () => {
        return window.location.href; // Current page URL
    };

    const getShareText = () => {
        return `Check out this amazing story: "${title}" by ${user}. ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`;
    };

    const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
        setShareMenuAnchor(event.currentTarget);
    };

    const handleShareClose = () => {
        setShareMenuAnchor(null);
    };

    const shareToWhatsApp = () => {
        const text = encodeURIComponent(getShareText());
        const url = `https://wa.me/?text=${text}`;
        window.open(url, '_blank');
        handleShareClose();
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(getShareUrl());
        const quote = encodeURIComponent(getShareText());
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        handleShareClose();
    };

    const shareToTwitter = () => {
        const text = encodeURIComponent(getShareText());
        const url = encodeURIComponent(getShareUrl());
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        handleShareClose();
    };

    const shareToLinkedIn = () => {
        const url = encodeURIComponent(getShareUrl());
        const title = encodeURIComponent(`Story: ${title}`);
        const summary = encodeURIComponent(content.substring(0, 200));
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=400');
        handleShareClose();
    };

    const shareToTelegram = () => {
        const text = encodeURIComponent(getShareText());
        const url = encodeURIComponent(getShareUrl());
        const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        window.open(telegramUrl, '_blank');
        handleShareClose();
    };

    const shareViaEmail = () => {
        const subject = encodeURIComponent(`Amazing Story: ${title}`);
        const body = encodeURIComponent(`Hi!\n\nI wanted to share this amazing story with you:\n\n"${title}" by ${user}\n\n${content}\n\nCheck it out here: ${getShareUrl()}\n\nBest regards!`);
        const emailUrl = `mailto:?subject=${subject}&body=${body}`;
        window.open(emailUrl);
        handleShareClose();
    };

    const copyToClipboard = async () => {
        try {
            const shareText = `${getShareText()}\n\n${getShareUrl()}`;
            await navigator.clipboard.writeText(shareText);
            setCopySuccess(true);
            handleShareClose();
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = `${getShareText()}\n\n${getShareUrl()}`;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess(true);
            handleShareClose();
        }
    };

    const downloadStoryImage = () => {
        // Create a canvas to combine story info with image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = 800;
            canvas.height = 600;
            
            // Draw image
            ctx.drawImage(img, 0, 0, 800, 400);
            
            // Add story details
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 400, 800, 200);
            
            // Add text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(title, 20, 440);
            
            ctx.font = '16px Arial';
            const words = content.split(' ');
            let line = '';
            let y = 470;
            
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > 760 && n > 0) {
                    ctx.fillText(line, 20, y);
                    line = words[n] + ' ';
                    y += 20;
                    if (y > 580) break; // Prevent overflow
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, 20, y);
            
            // Add user attribution
            ctx.font = 'italic 14px Arial';
            ctx.fillText(`- ${user}`, 20, 590);
            
            // Download
            const link = document.createElement('a');
            link.download = `story-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        };
        
        img.src = photo;
        handleShareClose();
    };

    // Web Share API (for mobile devices)
    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Story: ${title}`,
                    text: getShareText(),
                    url: getShareUrl(),
                });
                handleShareClose();
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to copy to clipboard
            copyToClipboard();
        }
    };

    return (
        <>
            {/* Story Card */}
            <Card sx={{ 
                width: 250, 
                minWidth: 250, 
                margin: '8px', 
                boxShadow: 2, 
                height: 400,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                }
            }}>
                <CardActionArea onClick={handleCardClick} sx={{ height: '100%' }}>
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia
                            component="img"
                            height="240"
                            image={photo}
                            alt={title}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/250x240?text=Image+Not+Available';
                            }}
                        />
                        
                        {/* Photo count indicator for multiple photos */}
                        {displayPhotos.length > 1 && (
                            <Box sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                borderRadius: 2,
                                px: 1,
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <FullscreenIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption" fontWeight="bold">
                                    {displayPhotos.length}
                                </Typography>
                            </Box>
                        )}

                        {/* Category chip */}
                        {category && (
                            <Chip
                                label={category}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    backgroundColor: 'rgba(76, 175, 80, 0.9)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        )}
                    </Box>
                    
                    <CardContent sx={{ height: 'calc(100% - 240px)', display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>
                        
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'text.secondary',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                flex: 1,
                                mb: 1
                            }}
                        >
                            {content}
                        </Typography>
                        
                        {/* User info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar 
                                    src={getUserAvatar()} 
                                    sx={{ width: 20, height: 20 }}
                                >
                                    <PersonIcon sx={{ fontSize: 12 }} />
                                </Avatar>
                                <Typography variant="caption" fontWeight="medium">
                                    {user}
                                </Typography>
                            </Box>
                            
                            {timestamp && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ScheduleIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatTimestamp(timestamp)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>

            {/* Story Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 3,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={getUserAvatar()} sx={{ width: 40, height: 40 }}>
                            <PersonIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {user}
                            </Typography>
                            {timestamp && (
                                <Typography variant="caption" color="text.secondary">
                                    {formatTimestamp(timestamp)}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    
                    <IconButton onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    {/* Story Title */}
                    <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {title}
                        </Typography>
                        {category && (
                            <Chip 
                                label={category} 
                                color="primary" 
                                size="small" 
                                sx={{ mb: 2 }}
                            />
                        )}
                    </Box>

                    {/* Photo Slider */}
                    <Box sx={{ mb: 3 }}>
                        {displayPhotos.length === 1 ? (
                            <Box sx={{ 
                                width: '100%', 
                                height: { xs: 300, sm: 400 }, 
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'grey.100'
                            }}>
                                <img
                                    src={displayPhotos[0]}
                                    alt={title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box>
                                {/* Auto-play swipeable views for multiple photos */}
                                <AutoPlaySwipeableViews
                                    axis="x"
                                    index={activeStep}
                                    onChangeIndex={handleStepChange}
                                    enableMouseEvents
                                    autoplay={autoPlayActive}
                                    interval={4000} // 4 seconds per slide
                                >
                                    {displayPhotos.map((photo, index) => (
                                        <Box
                                            key={index}
                                            sx={{ 
                                                height: { xs: 300, sm: 400 },
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: 'grey.100'
                                            }}
                                        >
                                            <img
                                                src={photo}
                                                alt={`${title} - Image ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </AutoPlaySwipeableViews>

                                {/* Mobile stepper for navigation */}
                                <MobileStepper
                                    steps={maxSteps}
                                    position="static"
                                    activeStep={activeStep}
                                    sx={{
                                        backgroundColor: 'transparent',
                                        justifyContent: 'center',
                                        pt: 1
                                    }}
                                    nextButton={
                                        <Button
                                            size="small"
                                            onClick={handleNext}
                                            disabled={maxSteps <= 1}
                                        >
                                            Next
                                            <KeyboardArrowRight />
                                        </Button>
                                    }
                                    backButton={
                                        <Button
                                            size="small"
                                            onClick={handleBack}
                                            disabled={maxSteps <= 1}
                                        >
                                            <KeyboardArrowLeft />
                                            Back
                                        </Button>
                                    }
                                />

                                {/* Photo counter */}
                                <Box sx={{ 
                                    textAlign: 'center', 
                                    py: 1,
                                    backgroundColor: 'rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {activeStep + 1} of {maxSteps} photos
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Story Content */}
                    <Box sx={{ px: 3, pb: 2 }}>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                                color: 'text.primary'
                            }}
                        >
                            {content}
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} variant="outlined">
                        Close
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleShareClick}
                        startIcon={<ShareIcon />}
                    >
                        Share Story
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Social Share Menu */}
            <Menu
                anchorEl={shareMenuAnchor}
                open={Boolean(shareMenuAnchor)}
                onClose={handleShareClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        minWidth: 250,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                        Share this story
                    </Typography>
                </Box>

                {/* Native Share (Mobile) */}
                {navigator.share && (
                    <MenuItem onClick={shareNative} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <ShareIcon sx={{ color: '#666' }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Share" 
                            secondary="Use device share menu"
                            primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                    </MenuItem>
                )}

                {/* WhatsApp */}
                <MenuItem onClick={shareToWhatsApp} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <WhatsAppIcon sx={{ color: '#25D366' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="WhatsApp" 
                        secondary="Share via WhatsApp"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>

                {/* Facebook */}
                <MenuItem onClick={shareToFacebook} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <FacebookIcon sx={{ color: '#1877F2' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Facebook" 
                        secondary="Share on Facebook"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>

                {/* Twitter */}
                <MenuItem onClick={shareToTwitter} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <TwitterIcon sx={{ color: '#1DA1F2' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Twitter" 
                        secondary="Tweet this story"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>

                {/* LinkedIn */}
                <MenuItem onClick={shareToLinkedIn} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <LinkedInIcon sx={{ color: '#0A66C2' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="LinkedIn" 
                        secondary="Share on LinkedIn"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>

                {/* Telegram */}
                <MenuItem onClick={shareToTelegram} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <TelegramIcon sx={{ color: '#0088cc' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Telegram" 
                        secondary="Share via Telegram"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                {/* Email */}
                <MenuItem onClick={shareViaEmail} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <EmailIcon sx={{ color: '#EA4335' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Email" 
                        secondary="Share via email"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>

                {/* Copy Link */}
                <MenuItem onClick={copyToClipboard} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <LinkIcon sx={{ color: '#666' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Copy Link" 
                        secondary="Copy story link"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>

                {/* Download as Image */}
                <MenuItem onClick={downloadStoryImage} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <DownloadIcon sx={{ color: '#4CAF50' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Download Image" 
                        secondary="Save story as image"
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                </MenuItem>
            </Menu>

            {/* Copy Success Snackbar */}
            <Snackbar
                open={copySuccess}
                autoHideDuration={3000}
                onClose={() => setCopySuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert 
                    onClose={() => setCopySuccess(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    Story link copied to clipboard!
                </MuiAlert>
            </Snackbar>
        </>
    );
}