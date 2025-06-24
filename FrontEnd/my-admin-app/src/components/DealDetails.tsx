// src/components/DealDetails.tsx

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
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
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BitDealerListTable from './BitDealerListTable';
import LaunchIcon from "@mui/icons-material/Launch";
import { Alert, Chip, Divider, Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ApiConfig from '../utils/ApiConfig';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import {
    LocalShipping as LocalShippingIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Inventory as InventoryIcon,
    Build as BuildIcon,
    FlightTakeoff as FlightTakeoffIcon,
    DirectionsRun as DirectionsRunIcon,
    Home as HomeIcon,
    ExpandMore as ExpandMoreIcon,
    TrackChanges as TrackChangesIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';

// Remove AutoPlaySwipeableViews to avoid the warning
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

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

// Add delivery interfaces
interface DeliveryStatus {
    id: number;
    name: string;
}

interface StatusHistory {
    id: number;
    statusDateChange: string;
    deliveryStaus: DeliveryStatus;
}

interface Payment {
    id: number;
    amount: number;
    note: string | null;
    file: string | null;
    status: boolean;
    filetype: string | null;
    paymentType: {
        id: number;
        name: string;
    };
}

interface DeliveryData {
    id: number;
    trackingNumber: string;
    location: string;
    currentPackageLocation: string;
    deliveryCompany: string;
    description: string;
    payment: Payment;
    sharedPost: any;
    currentStatus: DeliveryStatus;
    statusHistory: StatusHistory[];
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

    // Add delivery tracking state
    const [deliveryData, setDeliveryData] = React.useState<DeliveryData | null>(null);
    const [deliveryLoading, setDeliveryLoading] = React.useState(false);
    const [deliveryError, setDeliveryError] = React.useState<string>('');

    // Add bid form state (consolidated - remove duplicates)
    const [bidData, setBidData] = React.useState({
        bitrate: '',
        needamount: '',
        bitdetailscol: '',
        deliverylocation: ''
    });
    const [isSubmittingBid, setIsSubmittingBid] = React.useState(false);
    const [bidError, setBidError] = React.useState('');
    const [bidSuccess, setBidSuccess] = React.useState('');

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

    // Add auto-play functionality manually to avoid UNSAFE_componentWillReceiveProps
    const [autoPlayActive, setAutoPlayActive] = React.useState(true);
    const autoPlayIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Auto-play functionality
    React.useEffect(() => {
        if (autoPlayActive && displayImages.length > 1) {
            autoPlayIntervalRef.current = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % displayImages.length);
            }, 3000); // Change slide every 3 seconds
        }

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, [autoPlayActive, displayImages.length]);

    // Pause auto-play on user interaction
    const handleUserInteraction = () => {
        setAutoPlayActive(false);
        if (autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
        }
    };

    const handleNext = () => {
        handleUserInteraction();
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % displayImages.length);
    };

    const handleBack = () => {
        handleUserInteraction();
        setActiveStep((prevActiveStep) => 
            prevActiveStep === 0 ? displayImages.length - 1 : prevActiveStep - 1
        );
    };

    const handleStepChange = (step: number) => {
        handleUserInteraction();
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

    // Add function to fetch delivery data
    const fetchDeliveryData = async () => {
        if (!postDetails?.id) return;

        try {
            setDeliveryLoading(true);
            setDeliveryError('');
            
            const response = await fetch(`${ApiConfig.Domain}/delivery/getbypostid?postId=${postDetails.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: DeliveryData = await response.json();
                console.log('Fetched delivery data:', data);
                setDeliveryData(data);
            } else if (response.status === 404) {
                // No delivery data available
                setDeliveryData(null);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching delivery data:', err);
            setDeliveryError('Failed to load delivery information');
            setDeliveryData(null);
        } finally {
            setDeliveryLoading(false);
        }
    };

    // Fetch delivery data when component mounts and has confirmed bids
    React.useEffect(() => {
        if (postDetails?.id && postDetails?.bitDetails) {
            const hasConfirmedBids = postDetails.bitDetails.some(bid => bid.conformedstate);
            if (hasConfirmedBids) {
                fetchDeliveryData();
            }
        }
    }, [postDetails?.id, postDetails?.bitDetails]);

    // Add the missing handleBidAccepted function
    const handleBidAccepted = () => {
        // Refresh bids data
        setRefreshBids(prev => prev + 1);
        
        // Call parent callback if provided
        if (onBidSubmitted) {
            onBidSubmitted();
        }
        
        // Refetch delivery data since a bid was accepted
        if (postDetails?.id) {
            fetchDeliveryData();
        }
    };

    // Add missing formatDeliveryDate function
    const formatDeliveryDate = (timestamp: string): string => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return timestamp;
        }
    };

    // Add missing getDeliveryStatusColor function
    const getDeliveryStatusColor = (statusName: string) => {
        switch (statusName.toLowerCase()) {
            case 'order placed': return 'info';
            case 'order confirmed': return 'primary';
            case 'processing': return 'secondary';
            case 'ready for dispatch': return 'warning';
            case 'shipped': return 'warning';
            case 'in transit': return 'warning';
            case 'out for delivery': return 'secondary';
            case 'delivered': return 'success';
            default: return 'default';
        }
    };

    // Add missing getDeliveryStatusIcon function
    const getDeliveryStatusIcon = (statusName: string) => {
        switch (statusName.toLowerCase()) {
            case 'order placed': return <InventoryIcon />;
            case 'order confirmed': return <CheckCircleIcon />;
            case 'processing': return <BuildIcon />;
            case 'ready for dispatch': return <FlightTakeoffIcon />;
            case 'shipped': return <LocalShippingIcon />;
            case 'in transit': return <LocalShippingIcon />;
            case 'out for delivery': return <DirectionsRunIcon />;
            case 'delivered': return <HomeIcon />;
            default: return <ScheduleIcon />;
        }
    };

    // Delivery Status Timeline Component
    const DeliveryStatusTimeline = () => {
        if (deliveryLoading) {
            return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Loading delivery information...</Typography>
                </Box>
            );
        }

        if (deliveryError || !deliveryData) {
            return (
                <Box sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 2,
                    border: '1px dashed rgba(0, 0, 0, 0.1)'
                }}>
                    <TrackChangesIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {deliveryError || 'No delivery information available'}
                    </Typography>
                </Box>
            );
        }

        // Sort status history by date (newest first)
        const sortedHistory = [...deliveryData.statusHistory].sort((a, b) => 
            new Date(b.statusDateChange).getTime() - new Date(a.statusDateChange).getTime()
        );

        return (
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocalShippingIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">
                            🚚 Delivery Tracking
                        </Typography>
                        <Chip
                            label={deliveryData.currentStatus.name}
                            color={getDeliveryStatusColor(deliveryData.currentStatus.name)}
                            icon={getDeliveryStatusIcon(deliveryData.currentStatus.name)}
                            size="medium"
                        />
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Delivery Header Info */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Tracking Number</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {deliveryData.trackingNumber}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Delivery Company</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {deliveryData.deliveryCompany}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Current Location</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    📍 {deliveryData.currentPackageLocation}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Delivery Location</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    🎯 {deliveryData.location}
                                </Typography>
                            </Grid>
                            {deliveryData.description && (
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">Description</Typography>
                                    <Typography variant="body2">
                                        {deliveryData.description}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    {/* Payment Information */}
                    {deliveryData.payment && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                💳 Payment Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        Rs. {deliveryData.payment.amount.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={deliveryData.payment.status ? 'Paid' : 'Pending'}
                                        color={deliveryData.payment.status ? 'success' : 'warning'}
                                        size="small"
                                        icon={<PaymentIcon />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">Payment Type</Typography>
                                    <Typography variant="body1">
                                        {deliveryData.payment.paymentType.name}
                                    </Typography>
                                </Grid>
                                {deliveryData.payment.note && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Note</Typography>
                                        <Typography variant="body2">
                                            {deliveryData.payment.note}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}

                    {/* Status History Timeline */}
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        📈 Delivery Timeline
                    </Typography>
                    <Timeline>
                        {sortedHistory.map((status, index) => (
                            <TimelineItem key={status.id}>
                                <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                                    {formatDeliveryDate(status.statusDateChange)}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot color={getDeliveryStatusColor(status.deliveryStaus.name)}>
                                        {getDeliveryStatusIcon(status.deliveryStaus.name)}
                                    </TimelineDot>
                                    {index < sortedHistory.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span" fontWeight="bold">
                                        {status.deliveryStaus.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Status updated
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </AccordionDetails>
            </Accordion>
        );
    };

    if (!isOpen) {
        return null;
    }

    // Add function to filter bids based on acceptance status
    const getFilteredBitDetails = () => {
        if (!postDetails?.bitDetails) {
            return [];
        }

        const hasAcceptedBids = postDetails.bitDetails.some(bid => bid.conformedstate);
        
        if (hasAcceptedBids) {
            // If there's at least one accepted bid, show only accepted bids
            return postDetails.bitDetails.filter(bid => bid.conformedstate);
        } else {
            // If no accepted bids, show all bids
            return postDetails.bitDetails;
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
            disableEscapeKeyDown={isSubmittingBid}
        >
            {/* Fix the HTML nesting issue in DialogTitle */}
            <DialogTitle id="scroll-dialog-title" sx={{ p: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt={postDetails?.user?.name || "User"}
                            src={postDetails?.user?.avatar || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37"}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            {/* Fix: Use span instead of Typography with h6 to avoid nesting h6 inside h2 */}
                            <Box
                                component="span"
                                sx={{
                                    fontSize: '1.25rem',
                                    fontWeight: 500,
                                    lineHeight: 1.6,
                                    display: 'block',
                                    color: 'text.primary'
                                }}
                            >
                                {postDetails?.user?.name || "User Name"}
                            </Box>
                            <Typography variant="body2" color="text.secondary" component="div">
                                📍 {postDetails?.user?.city || "Location"} • 📞 {postDetails?.user?.mobileNumber || "Phone"}
                            </Typography>
                            <Rating
                                name="half-rating-read"
                                defaultValue={3.75}
                                precision={0.5}
                                readOnly
                                size="small"
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
                {/* Image carousel with manual SwipeableViews (no autoPlay) */}
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
                    {/* Use regular SwipeableViews without autoPlay */}
                    <SwipeableViews
                        axis="x"
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                        resistance
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
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
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

                {/* Delivery Tracking Section - Show only if there are confirmed bids */}
                {postDetails?.bitDetails?.some(bid => bid.conformedstate) && (
                    <Box sx={{ mb: 3 }}>
                        <DeliveryStatusTimeline />
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
                        bitDetails={getFilteredBitDetails()} // Now this function is defined
                        key={refreshBids}
                        onBidAccepted={handleBidAccepted}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClose}
                    disabled={isSubmittingBid}
                >
                    {isSubmittingBid ? 'Submitting...' : 'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}