// src/components/DealDetails.tsx

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BitDealerListTable from './BitDealerListTable';
import LaunchIcon from "@mui/icons-material/Launch";
import { Alert } from "@mui/material";
import ApiConfig from '../utils/ApiConfig';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface PostUser {
    id: number;
    name: string;
    city: string;
    address: string;
    mobileNumber: number;
    avatar: string;
    latitude?: number;  // Add latitude
    longitude?: number; // Add longitude
}

interface PostDetails {
    id: number;
    title: string;
    description: string;
    quantity: string;
    category: 'buying' | 'selling';
    timestamp: string;
    user: PostUser;
    images: string[];
    bidsCount: number;
    reviewsCount: number;
    bitDetails?: BitDetail[]; // Add bitDetails to PostDetails interface
}

// Add the BitDetail interface
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

// Props interface for the ScrollDialog component
interface ScrollDialogProps {
    open?: boolean;
    setOpen?: (open: boolean, bidSubmitted?: boolean) => void;
    onClose?: () => void;
    title?: string;
    type?: 'buying' | 'selling';
    media?: string[];
    postId?: number;
    postDetails?: PostDetails;
    onBidSubmitted?: () => void; // Add callback prop
}

export default function ScrollDialog({ 
    open = true, 
    setOpen, 
    onClose,
    title,
    type,
    media,
    postId,
    postDetails,
    onBidSubmitted
}: ScrollDialogProps) {
    const [isOpen, setIsOpen] = React.useState(open);
    const [scroll] = React.useState<"paper" | "body">("paper");
    const [activeStep, setActiveStep] = React.useState(0);
    const [bidSubmittedFlag, setBidSubmittedFlag] = React.useState(false);
    const [refreshBids, setRefreshBids] = React.useState(0);

    // Debug logging
    React.useEffect(() => {
        console.log('ScrollDialog received props:', {
            open,
            title,
            type,
            postId,
            postDetails: postDetails ? 'Present' : 'Missing',
            mediaCount: media?.length || 0
        });
    }, [open, title, type, postId, postDetails, media]);

    // Use provided images or fallback to default images
    const displayImages = postDetails?.images?.length ? 
        postDetails.images.map((url, index) => ({
            label: `Image ${index + 1}`,
            imgPath: url
        })) : 
        media?.length ?
        media.map((url, index) => ({
            label: `Image ${index + 1}`,
            imgPath: url
        })) :
        [
            {
                label: "Image 1",
                imgPath: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
            },
            {
                label: "Image 2",
                imgPath: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
            },
        ];

    const maxSteps = displayImages.length;

    // Update internal state when prop changes
    React.useEffect(() => {
        console.log('Setting dialog open state:', open);
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        console.log('Closing dialog, bid submitted:', bidSubmittedFlag);
        setIsOpen(false);
        
        // Call setOpen with bid submitted flag if provided
        if (setOpen) {
            setOpen(false, bidSubmittedFlag);
        }
        
        // Call onClose if provided (for simple close without bid tracking)
        if (onClose) {
            onClose();
        }
        
        // Reset flag
        setBidSubmittedFlag(false);
    };

    // Add the missing handleDialogClose function
    const handleDialogClose = () => {
        if (isSubmittingBid) {
            // Prevent closing during bid submission
            return;
        }
        handleClose();
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (isOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [isOpen]);

    // Debug: Log postDetails to check coordinates
    React.useEffect(() => {
        if (postDetails) {
            console.log('DealDetails - Coordinates received:', {
                latitude: postDetails.user?.latitude,
                longitude: postDetails.user?.longitude,
                latitudeType: typeof postDetails.user?.latitude,
                longitudeType: typeof postDetails.user?.longitude,
                address: postDetails.user?.address,
                city: postDetails.user?.city
            });
        }
    }, [postDetails]);

    // Function to open Google Maps
    const openInGoogleMaps = () => {
        if (postDetails?.user?.latitude && postDetails?.user?.longitude) {
            const lat = postDetails.user.latitude;
            const lng = postDetails.user.longitude;
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            window.open(googleMapsUrl, '_blank');
        } else if (postDetails?.user?.address && postDetails?.user?.city) {
            const address = encodeURIComponent(`${postDetails.user.address}, ${postDetails.user.city}`);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            window.open(googleMapsUrl, '_blank');
        } else {
            const city = encodeURIComponent(postDetails?.user?.city || 'Sri Lanka');
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${city}`;
            window.open(googleMapsUrl, '_blank');
        }
    };

    // Generate dynamic map URL with user's location
    const getMapUrl = () => {
        console.log('DealDetails - Generating map URL with coordinates:', {
            lat: postDetails?.user?.latitude,
            lng: postDetails?.user?.longitude,
            hasCoordinates: !!(postDetails?.user?.latitude && postDetails?.user?.longitude)
        });

        if (postDetails?.user?.latitude && postDetails?.user?.longitude) {
            const lat = postDetails.user.latitude;
            const lng = postDetails.user.longitude;
            console.log('DealDetails - Using coordinates for map:', { lat, lng });
            return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        } else if (postDetails?.user?.address && postDetails?.user?.city) {
            console.log('DealDetails - Using address for map:', postDetails.user.address, postDetails.user.city);
            const address = encodeURIComponent(`${postDetails.user.address}, ${postDetails.user.city}, Sri Lanka`);
            return `https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        console.log('DealDetails - Using fallback location');
        return `https://maps.google.com/maps?q=7.8731,80.7718&t=&z=10&ie=UTF8&iwloc=&output=embed`;
    };

    console.log('Rendering ScrollDialog with isOpen:', isOpen);

    if (!isOpen) {
        return null;
    }

    // Add new state for bid form
    const [bidData, setBidData] = React.useState({
        bitrate: '',
        needamount: '',
        bitdetailscol: '',
        deliverylocation: ''
    });
    const [isSubmittingBid, setIsSubmittingBid] = React.useState(false);
    const [bidError, setBidError] = React.useState('');
    const [bidSuccess, setBidSuccess] = React.useState('');

    // Handle bid form input changes
    const handleBidInputChange = (field: string, value: string) => {
        setBidData(prev => ({
            ...prev,
            [field]: value
        }));
        setBidError(''); // Clear error when user types
    };

    // Validate bid form
    const validateBidForm = (): boolean => {
        if (!bidData.bitrate || parseFloat(bidData.bitrate) <= 0) {
            setBidError('Please enter a valid price per unit.');
            return false;
        }
        
        if (!bidData.needamount || parseFloat(bidData.needamount) <= 0) {
            setBidError('Please enter a valid quantity needed.');
            return false;
        }

        if (!bidData.bitdetailscol.trim()) {
            setBidError('Please enter contact details or special notes.');
            return false;
        }

        return true;
    };

    // Submit bid to backend
    const handleSubmitBid = async () => {
        if (!validateBidForm()) return;
        if (!postDetails?.id) {
            setBidError('Post ID not available.');
            return;
        }

        setIsSubmittingBid(true);
        setBidError('');

        try {
            const bidPayload = {
                bitrate: parseFloat(bidData.bitrate),
                needamount: parseFloat(bidData.needamount),
                bitdetailscol: bidData.bitdetailscol.trim(),
                deliverylocation: bidData.deliverylocation.trim() || null,
                conformedstate: false
            };

            console.log('Submitting bid:', bidPayload);

            const response = await fetch(
                `${ApiConfig.Domain}/bitdetails/addbit?postid=${postDetails.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bidPayload)
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit bid: ${errorText}`);
            }

            // Handle both JSON and text responses
            let result;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
                console.log('Bid submitted successfully (JSON):', result);
            } else {
                result = await response.text();
                console.log('Bid submitted successfully (Text):', result);
            }
            
            setBidSuccess('Your bid has been submitted successfully!');
            setBidSubmittedFlag(true);
            
            // Reset form after successful submission
            setBidData({
                bitrate: '',
                needamount: '',
                bitdetailscol: '',
                deliverylocation: ''
            });

            // Trigger bid list refresh
            setRefreshBids(prev => prev + 1);

            // Call parent callback if provided
            if (onBidSubmitted) {
                onBidSubmitted();
            }

            // Auto-close success message after 3 seconds
            setTimeout(() => {
                setBidSuccess('');
            }, 3000);

        } catch (error) {
            console.error('Error submitting bid:', error);
            setBidError(error instanceof Error ? error.message : 'Failed to submit bid. Please try again.');
        } finally {
            setIsSubmittingBid(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleDialogClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            maxWidth="md"
            fullWidth
            disableEscapeKeyDown={isSubmittingBid} // Prevent ESC key during submission
        >
            <DialogTitle id="scroll-dialog-title" sx={{ p: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt={postDetails?.user?.name || "User"}
                            src={postDetails?.user?.avatar || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37"}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">
                                {postDetails?.user?.name || "User Name"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                📍 {postDetails?.user?.city || "Location"} • 📞 {postDetails?.user?.mobileNumber || "Phone"}
                            </Typography>
                            <Rating
                                name="half-rating-read"
                                defaultValue={3.75}
                                precision={0.5}
                                readOnly
                            />
                        </Box>
                        <Button variant="contained" color="success">
                            <TurnedInNotIcon sx={{ fontSize: 30 }} />
                            save
                        </Button>
                    </Stack>
                </Box>
            </DialogTitle>

            <DialogContent dividers={scroll === "paper"}>
                {/* Remove the test content and just show normal content */}
                <Box sx={{ maxWidth: "100%", flexGrow: 1, mb: 3 }}>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            height: 50,
                            pl: 2,
                            bgcolor: "background.default",
                        }}
                    >
                        <Typography>{displayImages[activeStep]?.label}</Typography>
                    </Paper>
                    <AutoPlaySwipeableViews
                        axis="x"
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {displayImages.map((step, index) => (
                            <div key={step.label}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 300,
                                            display: "block",
                                            maxWidth: "100%",
                                            overflow: "hidden",
                                            width: "100%",
                                            objectFit: "cover",
                                        }}
                                        src={step.imgPath}
                                        alt={step.label}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                                        }}
                                    />
                                ) : null}
                            </div>
                        ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                Next
                                <KeyboardArrowRight />
                            </Button>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                            >
                                <KeyboardArrowLeft />
                                Back
                            </Button>
                        }
                    />
                </Box>
                
                {/* Post Details Section */}
                {postDetails && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            📦 {postDetails.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                            {postDetails.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="body2">
                                <strong>Quantity:</strong> {postDetails.quantity}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Category:</strong> {postDetails.category?.toUpperCase()}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Bids:</strong> {postDetails.bidsCount}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Reviews:</strong> {postDetails.reviewsCount}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <strong>Address:</strong> {postDetails.user.address}
                        </Typography>
                        {/* Display coordinates if available */}
                        {postDetails.user.latitude && postDetails.user.longitude && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                <strong>Coordinates:</strong> {postDetails.user.latitude.toFixed(6)}, {postDetails.user.longitude.toFixed(6)}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Enhanced Map Section */}
                <Box sx={{ mt: 10 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            📍 Location Map
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<LaunchIcon />}
                            onClick={openInGoogleMaps}
                            size="small"
                            sx={{ 
                                textTransform: 'none',
                                borderRadius: 2
                            }}
                        >
                            Open in Google Maps
                        </Button>
                    </Box>
                    
                    {/* Debug information */}
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            Location Debug:
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                            Lat: {postDetails?.user?.latitude || 'Not available'} (Type: {typeof postDetails?.user?.latitude})
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                            Lng: {postDetails?.user?.longitude || 'Not available'} (Type: {typeof postDetails?.user?.longitude})
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                            Address: {postDetails?.user?.address || 'Not available'}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                            City: {postDetails?.user?.city || 'Not available'}
                        </Typography>
                    </Box>
                    
                    {postDetails?.user?.latitude && postDetails?.user?.longitude ? (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                                ✅ Showing exact location: {postDetails.user.latitude.toFixed(6)}, {postDetails.user.longitude.toFixed(6)}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                            ⚠️ Using address-based location
                        </Typography>
                    )}

                    <iframe
                        src={getMapUrl()}
                        width="100%"
                        height="450"
                        style={{ 
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    
                    {postDetails?.user?.address && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                            📍 {postDetails.user.address}
                        </Typography>
                    )}
                </Box>

                {/* Enhanced Bid Form */}
                <Box sx={{ mt: 4, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                        🤝 Place Your Bid
                    </Typography>

                    {/* Success Message */}
                    {bidSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {bidSuccess}
                        </Alert>
                    )}

                    {/* Error Message */}
                    {bidError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {bidError}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 3,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            <TextField
                                label="Price Per Unit (LKR)"
                                type="number"
                                variant="outlined"
                                value={bidData.bitrate}
                                onChange={(e) => handleBidInputChange('bitrate', e.target.value)}
                                placeholder="Enter your price per unit"
                                required
                                disabled={isSubmittingBid}
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ width: "48%" }}
                                helperText="Enter the rate you're willing to pay/receive per unit"
                            />
                            
                            <TextField
                                label="Quantity Needed"
                                type="number"
                                variant="outlined"
                                value={bidData.needamount}
                                onChange={(e) => handleBidInputChange('needamount', e.target.value)}
                                placeholder="Enter quantity"
                                required
                                disabled={isSubmittingBid}
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ width: "48%" }}
                                helperText="How much quantity do you need?"
                            />
                        </Box>

                        <TextField
                            label="Delivery Location"
                            variant="outlined"
                            value={bidData.deliverylocation}
                            onChange={(e) => handleBidInputChange('deliverylocation', e.target.value)}
                            placeholder="Enter preferred delivery location (optional)"
                            disabled={isSubmittingBid}
                            helperText="Where would you like the delivery? (Optional)"
                            fullWidth
                        />
                        
                        <TextField
                            label="Contact Details & Special Notes"
                            placeholder="Enter your contact number and any special requirements..."
                            multiline
                            rows={3}
                            variant="outlined"
                            value={bidData.bitdetailscol}
                            onChange={(e) => handleBidInputChange('bitdetailscol', e.target.value)}
                            required
                            disabled={isSubmittingBid}
                            helperText="Provide your contact details and any special instructions"
                            fullWidth
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => {
                                    setBidData({
                                        bitrate: '',
                                        needamount: '',
                                        bitdetailscol: '',
                                        deliverylocation: ''
                                    });
                                    setBidError('');
                                    setBidSuccess('');
                                }}
                                disabled={isSubmittingBid}
                                sx={{ minWidth: 100 }}
                            >
                                Clear
                            </Button>
                            
                            <Button 
                                variant="contained" 
                                color="success"
                                onClick={handleSubmitBid}
                                disabled={isSubmittingBid}
                                startIcon={<HandshakeIcon />}
                                sx={{ minWidth: 150 }}
                            >
                                {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 3, mb: 2 }}>
                    <BitDealerListTable 
                        postId={postDetails?.id} 
                        bitDetails={postDetails?.bitDetails}
                        key={refreshBids} // Force refresh when bids change
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClose}
                    disabled={isSubmittingBid} // Disable cancel during submission
                >
                    {isSubmittingBid ? 'Submitting...' : 'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}