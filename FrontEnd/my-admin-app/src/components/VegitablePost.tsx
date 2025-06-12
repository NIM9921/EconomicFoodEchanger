import React, { useState, useEffect } from 'react';
import {
    Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography,
    Box, ImageList, ImageListItem, ImageListItemBar, Chip, useMediaQuery, useTheme,
    Grid, Divider, Dialog, DialogContent, DialogTitle, MobileStepper, Fade, Backdrop
} from '@mui/material';
import {
    ThumbUp, ChatBubble, Share, StarBorder as StarBorderIcon,
    Person as PersonIcon, CalendarToday as CalendarIcon,
    Numbers as NumbersIcon, LocationOn as LocationIcon,
    Close as CloseIcon, KeyboardArrowLeft, KeyboardArrowRight,
    Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import ScrollDialog from './DealDetails';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ApiConfig from '../utils/ApiConfig';

// Define interfaces for API data
interface CommunityMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    address: string;
    shopOrFarmName: string;
    nic: string;
    mobileNumber: string;
    description: string;
    latitude?: number;   // Add these in case they exist
    longitude?: number;
}

interface User {
    id: number;
    name: string;
    city: string;
    address: string;
    status: boolean;
    nic: string;
    mobileNumber: number;
    username: string;
    password: string;
    latitude?: number;   
    longitude?: number;  
    roleList: Array<{
        id: number;
        name: string;
    }>;
    communityMember?: CommunityMember;  // Add communityMember
}

interface CategoryStatus {
    id: number;
    status: string;
}

interface BitDetails {
    id: number;
}

interface Review {
    id: number;
}

export interface SharedPostData {
    id: number;
    title: string;
    discription: string;
    quentity: string;
    latitude: string;
    longitude: string;
    image: string | null;
    createdateandtime: string;
    username: User;
    bitDetails: BitDetail[]; // Update to use full BitDetail interface
    reviews: Review[];
    categoreyStatus: CategoryStatus | null;
}

// Add the complete BitDetail interface
interface BitDetail {
    id: number;
    bitrate: number;
    needamount: number;
    bitdetailscol: string;
    deliverylocation: string | null;
    conformedstate: boolean;
    user: {
        id: number;
        name: string;
        city: string;
        address: string;
        status: boolean;
        nic: string;
        mobileNumber: number;
        username: string;
        password: string;
        roleList: Array<{
            id: number;
            name: string;
        }>;
        communityMember?: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            city: string;
            address: string;
            shopOrFarmName: string;
            nic: string;
            mobileNumber: string;
            description: string;
        };
    };
}

// Props for shared post from API
export interface SharedPostProps {
    post: SharedPostData;
    onBidSubmitted?: () => void; // Add callback for bid submission
}

// Photo Gallery Modal Component
const PhotoGalleryModal: React.FC<{
    open: boolean;
    onClose: () => void;
    images: string[];
    initialIndex: number;
    title: string;
}> = ({ open, onClose, images, initialIndex, title }) => {
    const [activeStep, setActiveStep] = useState(initialIndex);

    useEffect(() => {
        setActiveStep(initialIndex);
    }, [initialIndex]);

    const handleNext = () => {
        setActiveStep((prev) => (prev + 1) % images.length);
    };

    const handleBack = () => {
        setActiveStep((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') handleNext();
        if (event.key === 'ArrowLeft') handleBack();
        if (event.key === 'Escape') onClose();
    };

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyPress);
            return () => document.removeEventListener('keydown', handleKeyPress);
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            fullWidth
            PaperProps={{
                sx: {
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderRadius: 2,
                }
            }}
            BackdropComponent={Backdrop}
            BackdropProps={{
                sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'white',
                py: 1,
                px: 2
            }}>
                <Typography variant="h6" noWrap>
                    {title} - {activeStep + 1} of {images.length}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0, position: 'relative', height: '70vh' }}>
                <Box sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={images[activeStep]}
                        alt={`${title} - Image ${activeStep + 1}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: 8
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                        }}
                    />
                    
                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                onClick={handleBack}
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                <KeyboardArrowLeft fontSize="large" />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                <KeyboardArrowRight fontSize="large" />
                            </IconButton>
                        </>
                    )}
                </Box>
                
                {/* Image indicators */}
                {images.length > 1 && (
                    <Box sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1
                    }}>
                        {images.map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => setActiveStep(index)}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: index === activeStep ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        ))}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

// Main VegitablePost Component - Only for Community Posts
const VegitablePost: React.FC<SharedPostProps> = ({ post, onBidSubmitted }) => {
    const [liked, setLiked] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [coordinates, setCoordinates] = useState<{lat?: number, lng?: number}>({});
    const [coordinatesLoaded, setCoordinatesLoaded] = useState(false);
    const [dialogBitDetails, setDialogBitDetails] = useState<BitDetail[]>(post.bitDetails || []);
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [lastAddedBid, setLastAddedBid] = useState<BitDetail | null>(null);

    // Fetch updated bit details for this post only
    const fetchBitDetailsForPost = async () => {
        try {
            const response = await fetch(ApiConfig.Domain + `/sharedpost/${post.id}`);
            if (response.ok) {
                const data = await response.json();
                if (data.bitDetails && Array.isArray(data.bitDetails)) {
                    setDialogBitDetails(data.bitDetails);
                }
            }
        } catch (err) {
            // Optionally handle error
        }
    };

    // Handler for bid submission: update only bit details, not the whole page
    // Accepts an optional BitDetail object to append immediately
    const handleBidSubmitted = async (newBid?: BitDetail) => {
        if (newBid) {
            // Fire a custom event to append the new bid in BitDealerListTable
            window.dispatchEvent(new CustomEvent('append-new-bid', { detail: { newBid } }));
            setSuccessMsg('Your bid has been submitted successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Debug logging
    console.log('VegitablePost rendered with post:', post);

    const toggleLike = () => {
        setLiked(!liked);
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setGalleryOpen(true);
    };

    // Function to format timestamp
    const formatTimestamp = (timestamp: string): string => {
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInHours = diffInMs / (1000 * 60 * 60);

            if (diffInHours < 24) {
                if (diffInHours < 1) {
                    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
                }
                return `${Math.floor(diffInHours)} ${Math.floor(diffInHours) === 1 ? 'hour' : 'hours'} ago`;
            } else if (diffInHours < 48) {
                return 'Yesterday';
            } else {
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            }
        } catch (e) {
            return timestamp || 'Unknown date';
        }
    };

    // Function to get user avatar
    const getUserAvatar = (user: User): string => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4caf50&color=white&size=128`;
    };

    // Function to geocode address to get coordinates
    const geocodeAddress = async (address: string, city: string) => {
        try {
            console.log('Geocoding address:', address, city);
            const query = encodeURIComponent(`${address}, ${city}, Sri Lanka`);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lng = parseFloat(result.lon);
                    console.log('Geocoded coordinates:', { lat, lng });
                    setCoordinates({ lat, lng });
                    setCoordinatesLoaded(true);
                    return { lat, lng };
                }
            }
        } catch (error) {
            console.error('Geocoding failed:', error);
        }
        setCoordinatesLoaded(true);
        return null;
    };

    // Load coordinates when component mounts
    useEffect(() => {
        const loadCoordinates = () => {
            // Check if coordinates exist directly on the post
            if (post.latitude && post.longitude) {
                const lat = parseFloat(post.latitude);
                const lng = parseFloat(post.longitude);
                setCoordinates({ lat, lng });
                setCoordinatesLoaded(true);
                console.log('Using post coordinates:', { lat, lng });
                return;
            }

            // Fallback: check if coordinates exist in user data
            if (post.username.latitude && post.username.longitude) {
                setCoordinates({ 
                    lat: post.username.latitude, 
                    lng: post.username.longitude 
                });
                setCoordinatesLoaded(true);
                console.log('Using user coordinates:', { lat: post.username.latitude, lng: post.username.longitude });
                return;
            }

            // Fallback: check communityMember for coordinates
            if (post.username.communityMember?.latitude && post.username.communityMember?.longitude) {
                setCoordinates({ 
                    lat: post.username.communityMember.latitude, 
                    lng: post.username.communityMember.longitude 
                });
                setCoordinatesLoaded(true);
                console.log('Using communityMember coordinates:', { 
                    lat: post.username.communityMember.latitude, 
                    lng: post.username.communityMember.longitude 
                });
                return;
            }

            // If no coordinates found, try to geocode the address as fallback
            const address = post.username.address || post.username.communityMember?.address;
            const city = post.username.city || post.username.communityMember?.city;
            
            if (address && city) {
                console.log('No coordinates found, attempting to geocode:', { address, city });
                geocodeAddress(address, city);
            } else {
                setCoordinatesLoaded(true);
            }
        };

        loadCoordinates();
    }, [post]);

    // Debug log coordinates when they change
    useEffect(() => {
        console.log('VegitablePost coordinates updated:', coordinates);
    }, [coordinates]);

    // Load media information when component mounts
    useEffect(() => {
        const loadMediaInfo = async () => {
            try {
                console.log('Loading media for post ID:', post.id);
                const infoResponse = await fetch(ApiConfig.Domain + `/sharedpost/${post.id}/media-info`);

                if (infoResponse.ok) {
                    const mediaInfo = await infoResponse.json();
                    console.log('Media info response:', mediaInfo);
                    const urls = mediaInfo.files.map((file: any) =>
                        ApiConfig.Domain + `/sharedpost/media/${post.id}/${file.index}`
                    );
                    setMediaUrls(urls);
                } else {
                    console.log('Media info not available, using fallback');
                    setMediaUrls([ApiConfig.Domain + `/sharedpost/image/${post.id}`]);
                }
            } catch (error) {
                console.error('Error loading media info:', error);
                setMediaUrls([ApiConfig.Domain + `/sharedpost/image/${post.id}`]);
            } finally {
                setIsLoading(false);
            }
        };

        if (post.id) {
            loadMediaInfo();
        }
    }, [post.id]);

    const category = post.categoreyStatus?.status === 'Selling post' ? 'selling' : 'buying';

    // Convert API media URLs to image format for consistent rendering
    const apiImages = mediaUrls.map((url, index) => ({
        img: url,
        title: `${post.title} - Image ${index + 1}`,
        featured: index === 0 // First image is featured
    }));

    console.log('Rendering post with category:', category, 'images:', apiImages.length);

    // If still loading, show a loading state
    if (isLoading) {
        return (
            <Card sx={{
                mb: 2,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                p: 3
            }}>
                <Typography>Loading post...</Typography>
            </Card>
        );
    }

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
                            src={getUserAvatar(post.username)}
                            sx={{
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                bgcolor: category === 'buying' ? '#3f51b5' : '#4caf50'
                            }}
                        >
                            {post.username.name.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    action={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: isMobile ? 'column' : 'row' }}>
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
                                sx={{ ml: isMobile ? 0 : 1, mt: isMobile ? 0.5 : 0 }}
                            >
                                <i className="fa-solid fa-handshake" style={{color: "#ffffff"}}></i>
                                &nbsp;Deal
                            </Button>
                        </Box>
                    }
                    title={
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            {/* User Name */}
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ 
                                textAlign: 'left',
                                flex: '0 0 auto'
                            }}>
                                {post.username.name}
                            </Typography>
                            
                            {/* Time and Location in center */}
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                flex: '1 1 auto',
                                mx: 2
                            }}>
                                <Typography variant="caption" color="text.secondary" sx={{
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {formatTimestamp(post.createdateandtime || '')}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary" sx={{
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '120px'
                                    }}>
                                        {post.username.city || 'Location not specified'}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            {/* Empty space to balance the layout */}
                            <Box sx={{ flex: '0 0 auto', width: 0 }} />
                        </Box>
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
                        {post.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left' }}>
                        {post.discription}
                    </Typography>
                    
                    {/* Convert quantity to tags format for consistency */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        <Chip
                            label={`Quantity: ${post.quentity}`}
                            size="small"
                            variant="outlined"
                            sx={{
                                bgcolor: 'rgba(240, 247, 235, 0.8)',
                                borderColor: category === 'buying' ? '#3f51b5' : '#4caf50'
                            }}
                        />
                        {post.username.city && (
                            <Chip
                                label={`Location: ${post.username.city}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    bgcolor: 'rgba(240, 247, 235, 0.8)',
                                    borderColor: category === 'buying' ? '#3f51b5' : '#4caf50'
                                }}
                            />
                        )}
                    </Box>
                </CardContent>

                {/* Image Gallery */}
                {apiImages.length > 0 && (
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
                        {apiImages.slice(0, 3).map((item, index) => (
                            <ImageListItem
                                key={index}
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                cols={item.featured && !isMobile ? 2 : 1}
                                rows={item.featured && !isMobile ? 2 : 1}
                                onClick={() => handleImageClick(index)}
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
                                    onError={(e) => {
                                        console.log('Image failed to load:', item.img);
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                                    }}
                                />
                                
                                {/* Show remaining count on 3rd image when there are more than 3 images */}
                                {index === 2 && apiImages.length > 3 && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 1
                                    }}>
                                        <Typography 
                                            variant={isMobile ? "h4" : "h3"} 
                                            color="white" 
                                            fontWeight="bold"
                                            sx={{ 
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                            }}
                                        >
                                            +{apiImages.length - 3}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="white" 
                                            sx={{ 
                                                opacity: 0.9,
                                                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                            }}
                                        >
                                            more photos
                                        </Typography>
                                    </Box>
                                )}
                                
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
                        {post.bitDetails?.length || 0} bids • {post.reviews?.length || 0} reviews
                    </Typography>
                </CardActions>
            </Card>

            {/* Photo Gallery Modal */}
            <PhotoGalleryModal
                open={galleryOpen}
                onClose={() => setGalleryOpen(false)}
                images={mediaUrls}
                initialIndex={selectedImageIndex}
                title={post.title}
            />

            {successMsg && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color="success.main" align="center">
                        {successMsg}
                    </Typography>
                </Box>
            )}
            {showDialog && (
                <ScrollDialog 
                    open={showDialog} 
                    setOpen={async (open, bidSubmitted, newBid) => {
                        setShowDialog(open);
                        if (bidSubmitted && newBid) {
                            await handleBidSubmitted(newBid);
                        }
                    }}
                    onClose={() => setShowDialog(false)}
                    title={post.title}
                    type={category}
                    media={mediaUrls}
                    postId={post.id}
                    postDetails={{
                        id: post.id,
                        title: post.title,
                        description: post.discription,
                        quantity: post.quentity,
                        category: category,
                        timestamp: post.createdateandtime,
                        user: {
                            id: post.username.id,
                            name: post.username.name,
                            city: post.username.city,
                            address: post.username.address,
                            mobileNumber: post.username.mobileNumber,
                            avatar: getUserAvatar(post.username),
                            latitude: coordinates.lat || 
                                     (post.latitude ? parseFloat(post.latitude) : undefined) || 
                                     post.username.latitude || 
                                     post.username.communityMember?.latitude,
                            longitude: coordinates.lng || 
                                      (post.longitude ? parseFloat(post.longitude) : undefined) || 
                                      post.username.longitude || 
                                      post.username.communityMember?.longitude
                        },
                        images: mediaUrls,
                        bidsCount: dialogBitDetails.length,
                        reviewsCount: post.reviews?.length || 0,
                        bitDetails: dialogBitDetails
                    }}
                    onBidSubmitted={handleBidSubmitted}
                />
            )}
        </>
    );
};

export default VegitablePost;