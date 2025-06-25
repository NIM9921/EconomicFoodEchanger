// src/components/Settings.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Button,
    Grid,
    Divider,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    useTheme,
    useMediaQuery,
    Paper,
    Stack,
    Skeleton,
    Tab,
    Tabs,
    Slide,
    Fade,
    Collapse,
    Rating,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
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
    Person as PersonIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    Badge as BadgeIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Settings as SettingsIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    LocalShipping as LocalShippingIcon,
    Payment as PaymentIcon,
    Star as StarIcon,
    MoreVert as MoreVertIcon,
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon,
    Fullscreen as FullscreenIcon,
    Close as CloseIcon,
    Call as CallIcon,
    Message as MessageIcon,
    Handshake as HandshakeIcon,
    Block as BlockIcon,
    Report as ReportIcon,
    Inventory as InventoryIcon,
    DeliveryDining as DeliveryDiningIcon,
    TrackChanges as TrackChangesIcon
} from '@mui/icons-material';
import ApiConfig from '../utils/ApiConfig';
import { useNavigate } from 'react-router-dom';
import UserOwnPostDisplaying from './UserOwnPostDisplyaing';

interface UserData {
    id: number;
    name: string;
    username: string;
    city: string;
    address: string;
    status: boolean;
    nic: string;
    mobileNumber: number;
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
}

// Add interface for user's own posts
interface UserSharedPost {
    id: number;
    title: string;
    discription: string;
    longitude: string;
    latitude: string;
    quentity: string | null;
    image: string;
    createdateandtime: string;
    username: {
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
    bitDetails: Array<{
        id: number;
        bitrate: number;
        needamount: number;
        bitdetailscol: string;
        deliverylocation: string;
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
    }>;
    reviews: any[];
    categoreyStatus: {
        id: number;
        status: string;
    } | null;
    complete: boolean;
    conformed: boolean;
}

// Add new interfaces for deal management
interface DealData {
    id: number;
    postId: number;
    bidId: number;
    buyerId: number;
    sellerId: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    amount: number;
    quantity: number;
    deliveryLocation: string;
    agreedDate: string;
    completedDate?: string;
    rating?: number;
    review?: string;
    createdAt: string;
}

// Add new interfaces for delivery data
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
    sharedPost: any; // You can use existing UserSharedPost interface
    currentStatus: DeliveryStatus;
    statusHistory: StatusHistory[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function UserProfile() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedData, setEditedData] = useState<UserData | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [updating, setUpdating] = useState(false);
    
    // Add new state for user's posts
    const [userPosts, setUserPosts] = useState<UserSharedPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState('');

    // Add new state for tabs and deals
    const [tabValue, setTabValue] = useState(0);
    const [deals, setDeals] = useState<DealData[]>([]);
    const [dealsLoading, setDealsLoading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [currentImageSet, setCurrentImageSet] = useState<string[]>([]);
    const [bidMenuAnchor, setBidMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedBid, setSelectedBid] = useState<any>(null);
    const [dealDialogOpen, setDealDialogOpen] = useState(false);
    const [dealFormData, setDealFormData] = useState({
        deliveryDate: '',
        deliveryLocation: '',
        specialInstructions: ''
    });

    // Add new state for delivery tracking
    const [deliveryData, setDeliveryData] = useState<{ [postId: number]: DeliveryData }>({});
    const [deliveryLoading, setDeliveryLoading] = useState<{ [postId: number]: boolean }>({});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    // Fetch user data from API
    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                setError('');
                
                // Get user ID from localStorage or use a default (you might want to store this during login)
                const userId = localStorage.getItem('userId') || '1'; // Default to 1 if not found
                
                const response = await fetch(`${ApiConfig.Domain}/user/getbyid?id=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: UserData = await response.json();
                console.log('Fetched user data:', data);
                
                setUserData(data);
                
                // Fetch user's posts after getting user data - no need to pass userId anymore
                await fetchUserPosts(userId);
                
            } catch (err) {
                console.error('Error loading user data:', err);
                setError(`Failed to load user data: ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    // Add function to fetch user's own posts - FIXED
    const fetchUserPosts = async (userId: string) => {
        try {
            setPostsLoading(true);
            setPostsError('');
            
            const response = await fetch(`${ApiConfig.Domain}/sharedpost/getposybyuserid`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // if using JWT
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: UserSharedPost[] = await response.json();
            console.log('Fetched user posts:', data);
            setUserPosts(data);
        } catch (err) {
            console.error('Error loading user posts:', err);
            setPostsError(`Failed to load posts: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setUserPosts([]);
        } finally {
            setPostsLoading(false);
        }
    };

    // Add function to fetch deals
    const fetchDeals = async () => {
        try {
            setDealsLoading(true);
            const response = await fetch(`${ApiConfig.Domain}/deals/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const dealsData = await response.json();
                setDeals(dealsData);
            }
        } catch (err) {
            console.error('Error loading deals:', err);
        } finally {
            setDealsLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditedData(userData);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editedData) return;

        try {
            setUpdating(true);
            setError('');

            // Make API call to update user data
            const response = await fetch(`${ApiConfig.Domain}/user/${editedData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedData: UserData = await response.json();
            setUserData(updatedData);
            setEditDialogOpen(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(`Failed to update profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        if (!editedData) return;

        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (parent === 'communityMember' && editedData.communityMember) {
                setEditedData({
                    ...editedData,
                    communityMember: {
                        ...editedData.communityMember,
                        [child]: value
                    }
                });
            }
        } else {
            setEditedData({
                ...editedData,
                [field]: value
            });
        }
    };

    const getUserAvatar = (): string => {
        if (!userData) return '';
        const name = userData.communityMember 
            ? `${userData.communityMember.firstName} ${userData.communityMember.lastName}`
            : userData.name;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4caf50&color=white&size=128`;
    };

    const getDisplayName = (): string => {
        if (!userData) return '';
        return userData.communityMember 
            ? `${userData.communityMember.firstName} ${userData.communityMember.lastName}`
            : userData.name;
    };

    const getRoleNames = (): string[] => {
        return userData?.roleList.map(role => role.name) || [];
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                        <Skeleton variant="text" height={32} width="80%" sx={{ mx: 'auto', mb: 1 }} />
                        <Skeleton variant="text" height={20} width="60%" sx={{ mx: 'auto', mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
                            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
                        </Box>
                        <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 2 }} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Skeleton variant="text" height={28} width="200px" sx={{ mb: 2 }} />
                        <Divider sx={{ mb: 3 }} />
                        {[1, 2, 3, 4].map((item) => (
                            <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" height={16} width="100px" sx={{ mb: 0.5 }} />
                                    <Skeleton variant="text" height={20} width="200px" />
                                </Box>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    // Enhanced function to convert image data URL - matching Home component
    const convertImageToDataUrl = (imageData: string | null, postId?: number): string => {
        const defaultImage = "https://fastly.picsum.photos/id/75/1999/2998.jpg?hmac=0agRZd8c5CRiFvADOWJqfTv6lqYBty3Kw-9LEtLp_98";

        if (!imageData) {
            // If no image data, try to fetch from API like Home component
            if (postId) {
                return `${ApiConfig.Domain}/sharedpost/image/${postId}`;
            }
            return defaultImage;
        }

        if (imageData.startsWith('data:image')) {
            return imageData;
        }

        if (imageData.startsWith('http')) {
            return imageData;
        }

        return `data:image/jpeg;base64,${imageData}`;
    };

    // Add function to format timestamp
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

    // Enhanced image handling with slideshow
    const openImageDialog = (images: string[], startIndex = 0) => {
        setCurrentImageSet(images);
        setSelectedImageIndex(startIndex);
        setImageDialogOpen(true);
    };

    const handleImageNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setSelectedImageIndex((prev) => 
                prev === 0 ? currentImageSet.length - 1 : prev - 1
            );
        } else {
            setSelectedImageIndex((prev) => 
                prev === currentImageSet.length - 1 ? 0 : prev + 1
            );
        }
    };

    // Deal management functions
    const handleAcceptBid = async (bidId: number, postId: number) => {
        try {
            const response = await fetch(`${ApiConfig.Domain}/deals/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bidId,
                    postId,
                    ...dealFormData
                }),
            });

            if (response.ok) {
                setSuccess('Bid accepted successfully! Deal created.');
                fetchUserPosts(localStorage.getItem('userId') || '1');
                fetchDeals();
            }
        } catch (err) {
            setError('Failed to accept bid');
        } finally {
            setDealDialogOpen(false);
            setBidMenuAnchor(null);
        }
    };

    const handleRejectBid = async (bidId: number) => {
        try {
            const response = await fetch(`${ApiConfig.Domain}/bids/reject/${bidId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setSuccess('Bid rejected successfully');
                fetchUserPosts(localStorage.getItem('userId') || '1');
            }
        } catch (err) {
            setError('Failed to reject bid');
        }
        setBidMenuAnchor(null);
    };

    const getDealStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'confirmed': return 'info';
            case 'in_progress': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getDealStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircleIcon />;
            case 'confirmed': return <HandshakeIcon />;
            case 'in_progress': return <LocalShippingIcon />;
            case 'cancelled': return <BlockIcon />;
            default: return <ScheduleIcon />;
        }
    };

    // Move handleAcceptClick function here, outside of UserPostCard
    const handleAcceptClick = () => {
        setDealFormData({
            deliveryDate: '',
            deliveryLocation: selectedBid?.deliverylocation || '',
            specialInstructions: ''
        });
        setDealDialogOpen(true);
    };

    // Add missing fetchDeliveryData function
    const fetchDeliveryData = async (postId: number) => {
        try {
            setDeliveryLoading(prev => ({ ...prev, [postId]: true }));
            setDeliveryError('');
            
            const response = await fetch(`${ApiConfig.Domain}/delivery/getbypostid?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: DeliveryData = await response.json();
                console.log('Fetched delivery data for post', postId, ':', data);
                setDeliveryData(prev => ({ ...prev, [postId]: data }));
            } else if (response.status === 404) {
                // No delivery data available
                setDeliveryData(prev => ({ ...prev, [postId]: undefined as any }));
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching delivery data:', err);
            setDeliveryData(prev => ({ ...prev, [postId]: undefined as any }));
        } finally {
            setDeliveryLoading(prev => ({ ...prev, [postId]: false }));
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
    const DeliveryStatusTimeline = ({ postId }: { postId: number }) => {
        const delivery = deliveryData[postId];
        const loading = deliveryLoading[postId];

        if (loading) {
            return (
                <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" height={24} width="150px" sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={100} />
                </Box>
            );
        }

        if (!delivery) {
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
                        No delivery information available
                    </Typography>
                </Box>
            );
        }

        // Sort status history by date (newest first)
        const sortedHistory = [...delivery.statusHistory].sort((a, b) => 
            new Date(b.statusDateChange).getTime() - new Date(a.statusDateChange).getTime()
        );

        return (
            <Box sx={{ p: 2 }}>
                {/* Delivery Header Info */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Tracking Number</Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {delivery.trackingNumber}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Delivery Company</Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {delivery.deliveryCompany}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Current Location</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                📍 {delivery.currentPackageLocation}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Delivery Location</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                🎯 {delivery.location}
                            </Typography>
                        </Grid>
                        {delivery.description && (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Description</Typography>
                                <Typography variant="body2">
                                    {delivery.description}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* Current Status */}
                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={delivery.currentStatus.name}
                        color={getDeliveryStatusColor(delivery.currentStatus.name)}
                        icon={getDeliveryStatusIcon(delivery.currentStatus.name)}
                        size="medium"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                {/* Payment Information */}
                {delivery.payment && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            💳 Payment Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Amount</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    Rs. {delivery.payment.amount.toFixed(2)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Status</Typography>
                                <Chip
                                    label={delivery.payment.status ? 'Paid' : 'Pending'}
                                    color={delivery.payment.status ? 'success' : 'warning'}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Payment Type</Typography>
                                <Typography variant="body1">
                                    {delivery.payment.paymentType.name}
                                </Typography>
                            </Grid>
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
            </Box>
        );
    };

    // Enhanced Post Card Component - matching Home component style
    const UserPostCard = ({ post }: { post: UserSharedPost }) => {
        const [mediaUrls, setMediaUrls] = useState<string[]>([]);
        const [isLoadingMedia, setIsLoadingMedia] = useState(true);
        const [expandedBids, setExpandedBids] = useState(false);
        const category = post.categoreyStatus?.status === 'Selling post' ? 'selling' : 'buying';
        
        // Load media information similar to Home component
        useEffect(() => {
            const loadMediaInfo = async () => {
                try {
                    console.log('Loading media for post ID:', post.id);
                    const infoResponse = await fetch(`${ApiConfig.Domain}/sharedpost/${post.id}/media-info`);

                    if (infoResponse.ok) {
                        const mediaInfo = await infoResponse.json();
                        console.log('Media info response:', mediaInfo);
                        const urls = mediaInfo.files.map((file: any) =>
                            `${ApiConfig.Domain}/sharedpost/media/${post.id}/${file.index}`
                        );
                        setMediaUrls(urls);
                    } else {
                        console.log('Media info not available, using fallback');
                        setMediaUrls([`${ApiConfig.Domain}/sharedpost/image/${post.id}`]);
                    }
                } catch (error) {
                    console.error('Error loading media info:', error);
                    setMediaUrls([`${ApiConfig.Domain}/sharedpost/image/${post.id}`]);
                } finally {
                    setIsLoadingMedia(false);
                }
            };

            if (post.id) {
                loadMediaInfo();
            }
        }, [post.id]);
        
        // Load delivery data if post has confirmed bids
        useEffect(() => {
            // Load delivery data if post has confirmed bids
            const hasConfirmedBids = post.bitDetails.some(bid => bid.conformedstate);
            if (hasConfirmedBids) {
                fetchDeliveryData(post.id);
            }
        }, [post.id]);
        
        const handleBidMenuClick = (event: React.MouseEvent<HTMLElement>, bid: any) => {
            setBidMenuAnchor(event.currentTarget);
            setSelectedBid(bid);
        };

        // Add function to get filtered bids for display
        const getFilteredBids = () => {
            const hasAcceptedBids = post.bitDetails.some(bid => bid.conformedstate);
            
            if (hasAcceptedBids) {
                // If there's at least one accepted bid, show only accepted bids
                return post.bitDetails.filter(bid => bid.conformedstate);
            } else {
                // If no accepted bids, show all bids
                return post.bitDetails;
            }
        };

        const filteredBids = getFilteredBids();
        const hasAcceptedBids = post.bitDetails.some(bid => bid.conformedstate);
        const totalBids = post.bitDetails.length;
        const acceptedBids = post.bitDetails.filter(bid => bid.conformedstate).length;

        return (
            <Card sx={{
                mb: 3,
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

                <CardContent sx={{ p: 3 }}>
                    {/* Post Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {post.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                {post.discription}
                            </Typography>
                        </Box>
                        <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<HandshakeIcon />}
                                    sx={{
                                        bgcolor: '#FF6B35',
                                        '&:hover': {
                                            bgcolor: '#E55A2B'
                                        },
                                        fontWeight: 'bold',
                                        px: 2
                                    }}
                                    onClick={() => {
                                        // Handle deal button click - you can customize this action
                                        console.log('Deal button clicked for post:', post.id);
                                        // Example: navigate to deal creation page
                                        // navigate(`/create-deal/${post.id}`);
                                        // Or open a deal dialog
                                        setSuccess('Deal feature coming soon!');
                                    }}
                                >
                                    Deal
                                </Button>
                                <Chip
                                    label={category === 'buying' ? 'BUYING' : 'SELLING'}
                                    color={category === 'buying' ? 'primary' : 'success'}
                                    size="medium"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {formatTimestamp(post.createdateandtime)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Enhanced Image Slideshow */}
                    {!isLoadingMedia && mediaUrls.length > 0 && (
                        <Box sx={{ mb: 3, position: 'relative' }}>
                            {mediaUrls.length === 1 ? (
                                <Box sx={{ position: 'relative' }}>
                                    <img
                                        src={mediaUrls[0]}
                                        alt={post.title}
                                        style={{
                                            width: '100%',
                                            height: '350px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => openImageDialog(mediaUrls, 0)}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                        }}
                                    />
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'rgba(0,0,0,0.7)'
                                            }
                                        }}
                                        onClick={() => openImageDialog(mediaUrls, 0)}
                                    >
                                        <FullscreenIcon />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Box>
                                    <Grid container spacing={1}>
                                        {mediaUrls.slice(0, 4).map((url, index) => (
                                            <Grid item xs={6} sm={3} key={index}>
                                                <Box sx={{ position: 'relative' }}>
                                                    <img
                                                        src={url}
                                                        alt={`${post.title} - Image ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '150px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => openImageDialog(mediaUrls, index)}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Image+Not+Available';
                                                        }}
                                                    />
                                                    {index === 3 && mediaUrls.length > 4 && (
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => openImageDialog(mediaUrls, index)}
                                                        >
                                                            <Typography variant="h5" color="white" fontWeight="bold">
                                                                +{mediaUrls.length - 4}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                                        <Button
                                            size="small"
                                            onClick={() => openImageDialog(mediaUrls, 0)}
                                            startIcon={<FullscreenIcon />}
                                        >
                                            View All {mediaUrls.length} Images
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}

                    {isLoadingMedia && (
                        <Box sx={{ mb: 3 }}>
                            <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 2 }} />
                        </Box>
                    )}

                    {/* Post Details */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                        {post.quentity && (
                            <Chip
                                label={`Quantity: ${post.quentity}`}
                                size="medium"
                                variant="outlined"
                                sx={{
                                    bgcolor: 'rgba(240, 247, 235, 0.8)',
                                    borderColor: category === 'buying' ? '#3f51b5' : '#4caf50'
                                }}
                            />
                        )}
                        <Chip
                            label={`${filteredBids.length} ${hasAcceptedBids ? 'confirmed deal' : 'bid'}${filteredBids.length !== 1 ? 's' : ''}`}
                            size="medium"
                            variant="outlined"
                            color={hasAcceptedBids ? 'success' : (post.bitDetails.length > 0 ? 'success' : 'default')}
                        />
                        {/* Show additional info if filtering */}
                        {hasAcceptedBids && acceptedBids < totalBids && (
                            <Chip
                                label={`${totalBids - acceptedBids} pending`}
                                size="small"
                                variant="outlined"
                                color="warning"
                            />
                        )}
                        <Chip
                            label={post.complete ? 'Completed' : 'Active'}
                            size="medium"
                            color={post.complete ? 'success' : 'warning'}
                        />
                        {post.conformed && (
                            <Chip
                                label="Confirmed"
                                size="medium"
                                color="success"
                            />
                        )}
                        {post.latitude && post.longitude && (
                            <Chip
                                label="📍 Location Available"
                                size="medium"
                                variant="outlined"
                                color="info"
                            />
                        )}
                    </Box>

                    {/* Enhanced Bids Management */}
                    {filteredBids.length > 0 && (
                        <Box sx={{ 
                            bgcolor: 'rgba(0, 0, 0, 0.03)', 
                            borderRadius: 2, 
                            p: 3, 
                            border: '1px solid rgba(0, 0, 0, 0.1)' 
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {hasAcceptedBids ? 'Confirmed Deals' : 'Bids Management'} ({filteredBids.length})
                                    </Typography>
                                    {hasAcceptedBids && acceptedBids < totalBids && (
                                        <Typography variant="caption" color="text.secondary">
                                            Showing accepted deals only ({acceptedBids} of {totalBids} total bids)
                                        </Typography>
                                    )}
                                </Box>
                                <Button
                                    size="small"
                                    onClick={() => setExpandedBids(!expandedBids)}
                                    variant="outlined"
                                >
                                    {expandedBids ? 'Show Less' : 'Show All'}
                                </Button>
                            </Box>

                            {/* Add filtering notice */}
                            {hasAcceptedBids && (
                                <Alert 
                                    severity="success" 
                                    sx={{ mb: 2 }}
                                    icon={<CheckCircleIcon />}
                                >
                                    <Typography variant="body2">
                                        This post has confirmed deals. Only accepted bids are shown below.
                                    </Typography>
                                </Alert>
                            )}

                            {/* Delivery Status Section - Show if any bid is confirmed */}
                            {post.bitDetails.some(bid => bid.conformedstate) && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        🚚 Delivery Tracking
                                    </Typography>
                                    <DeliveryStatusTimeline postId={post.id} />
                                </Box>
                            )}

                            <Collapse in={expandedBids} timeout="auto" unmountOnExit>
                                <Stack spacing={2}>
                                    {filteredBids.map((bid, index) => (
                                        <Card key={bid.id} sx={{ 
                                            p: 2,
                                            bgcolor: 'white',
                                            border: `2px solid ${bid.conformedstate ? '#4caf50' : 'rgba(0, 0, 0, 0.05)'}`,
                                            position: 'relative',
                                            // Enhanced styling for accepted bids
                                            ...(bid.conformedstate && {
                                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                                                bgcolor: 'rgba(76, 175, 80, 0.02)'
                                            })
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                                        {bid.user.name.charAt(0)}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {bid.user.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {bid.user.city} • {bid.user.mobileNumber}
                                                        </Typography>
                                                        {bid.bitdetailscol && (
                                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                                📝 {bid.bitdetailscol}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ textAlign: 'right', mr: 2 }}>
                                                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                        Rs. {bid.bitrate.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {bid.needamount} kg
                                                    </Typography>
                                                    {bid.deliverylocation && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            📍 {bid.deliverylocation}
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {bid.conformedstate ? (
                                                    <Chip
                                                        label="Deal Confirmed"
                                                        color="success"
                                                        icon={<CheckCircleIcon />}
                                                    />
                                                ) : (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleBidMenuClick(e, bid)}
                                                            sx={{ 
                                                                bgcolor: 'rgba(0,0,0,0.04)',
                                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
                                                            }}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Quick Contact Actions */}
                                            <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                                                <Button
                                                    size="small"
                                                    startIcon={<CallIcon />}
                                                    href={`tel:${bid.user.mobileNumber}`}
                                                    variant="outlined"
                                                >
                                                    Call
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<MessageIcon />}
                                                    href={`sms:${bid.user.mobileNumber}`}
                                                    variant="outlined"
                                                >
                                                    SMS
                                                </Button>
                                                {bid.conformedstate && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<LocalShippingIcon />}
                                                        variant="contained"
                                                        color="success"
                                                    >
                                                        Track Deal
                                                    </Button>
                                                )}
                                            </Box>
                                        </Card>
                                    ))}
                                </Stack>
                            </Collapse>

                            {!expandedBids && (
                                <Stack spacing={2}>
                                    {filteredBids.slice(0, 2).map((bid, index) => (
                                        <Card key={bid.id} sx={{ 
                                            p: 2,
                                            bgcolor: 'white',
                                            border: `2px solid ${bid.conformedstate ? '#4caf50' : 'rgba(0, 0, 0, 0.05)'}`,
                                            // Enhanced styling for accepted bids
                                            ...(bid.conformedstate && {
                                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                                                bgcolor: 'rgba(76, 175, 80, 0.02)'
                                            })
                                        }}>
                                            {/* Same bid content as above but shortened */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                        {bid.user.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {bid.user.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {bid.user.city}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                        Rs. {bid.bitrate.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {bid.needamount} kg
                                                    </Typography>
                                                </Box>
                                                {bid.conformedstate ? (
                                                    <Chip label="Confirmed" color="success" size="small" />
                                                ) : (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleBidMenuClick(e, bid)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    )}

                    {/* No bids message - updated for filtered view */}
                    {filteredBids.length === 0 && post.bitDetails.length === 0 && (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                            borderRadius: 2,
                            border: '1px dashed rgba(0, 0, 0, 0.1)'
                        }}>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                💼 No bids yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Waiting for community members to place bids on this post.
                            </Typography>
                        </Box>
                    )}

                    {/* Message when all bids are pending (not shown due to filter) */}
                    {filteredBids.length === 0 && post.bitDetails.length > 0 && (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 4,
                            bgcolor: 'rgba(255, 193, 7, 0.02)',
                            borderRadius: 2,
                            border: '1px dashed rgba(255, 193, 7, 0.3)'
                        }}>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                ⏳ All bids are pending
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                You have {post.bitDetails.length} pending bid{post.bitDetails.length !== 1 ? 's' : ''} waiting for your review.
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    // Add Deals Tab Component
    const DealsTab = () => (
        <Box>
            {dealsLoading ? (
                <Stack spacing={2}>
                    {[1, 2, 3].map((item) => (
                        <Skeleton key={item} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                    ))}
                </Stack>
            ) : deals.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <HandshakeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No deals yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your confirmed deals will appear here
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {deals.map((deal) => (
                        <Card key={deal.id} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Deal #{deal.id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {deal.agreedDate}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={deal.status.replace('_', ' ').toUpperCase()}
                                    color={getDealStatusColor(deal.status)}
                                    icon={getDealStatusIcon(deal.status)}
                                />
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                                    <Typography variant="h6">Rs. {deal.amount.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Quantity</Typography>
                                    <Typography variant="h6">{deal.quantity} kg</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">Delivery Location</Typography>
                                    <Typography variant="body1">{deal.deliveryLocation}</Typography>
                                </Grid>
                            </Grid>
                            {deal.rating && (
                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                                    <Typography variant="body2" color="text.secondary">Rating</Typography>
                                    <Rating value={deal.rating} readOnly size="small" />
                                    {deal.review && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            "{deal.review}"
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );

    // Loading state
    if (loading) {
        return (
            <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" height={40} width="200px" sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={24} width="400px" />
                </Box>
                <LoadingSkeleton />
            </Box>
        );
    }

    if (!userData && error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    No user data available.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    User Profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account information and preferences
                </Typography>
            </Box>

            {/* Success/Error Messages */}
            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Profile Overview Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Avatar
                                src={getUserAvatar()}
                                sx={{ 
                                    width: 120, 
                                    height: 120, 
                                    mx: 'auto', 
                                    mb: 2,
                                    boxShadow: 3
                                }}
                            />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {getDisplayName()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                @{userData.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                ID: {userData.id} • Status: {userData.status ? 'Active' : 'Inactive'}
                            </Typography>
                            
                            <Box sx={{ mt: 2, mb: 3 }}>
                                {getRoleNames().map((role, index) => (
                                    <Chip
                                        key={index}
                                        label={role.charAt(0).toUpperCase() + role.slice(1)}
                                        color="primary"
                                        size="small"
                                        sx={{ m: 0.5 }}
                                    />
                                ))}
                            </Box>
                            
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={handleEditClick}
                                fullWidth
                                sx={{ borderRadius: 2 }}
                                disabled={updating}
                            >
                                Edit Profile
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Basic Information */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Basic Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Full Name
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {userData.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Username
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {userData.username}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Mobile Number
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {userData.mobileNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <BadgeIcon sx={{ mr: 2, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                NIC
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {userData.nic}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                        <LocationIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {userData.address}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {userData.city}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Community Member Information */}
                {userData.communityMember && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Community Member Information
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Community Name
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {userData.communityMember.firstName} {userData.communityMember.lastName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Community Email
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {userData.communityMember.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Shop/Farm Name
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {userData.communityMember.shopOrFarmName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Community Mobile
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {userData.communityMember.mobileNumber}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                            <LocationIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Community Address
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {userData.communityMember.address}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {userData.communityMember.city}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <SettingsIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Description
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {userData.communityMember.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Edit Profile Dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)} 
                maxWidth="md" 
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle>
                    Edit Profile Information
                </DialogTitle>
                <DialogContent>
                    {editedData && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={editedData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={editedData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile Number"
                                    type="number"
                                    value={editedData.mobileNumber}
                                    onChange={(e) => handleInputChange('mobileNumber', parseInt(e.target.value) || 0)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={editedData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    multiline
                                    rows={3}
                                    value={editedData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                />
                            </Grid>
                            
                            {/* Community Member Fields */}
                            {editedData.communityMember && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Community Member Information
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            value={editedData.communityMember.firstName}
                                            onChange={(e) => handleInputChange('communityMember.firstName', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            value={editedData.communityMember.lastName}
                                            onChange={(e) => handleInputChange('communityMember.lastName', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Community Email"
                                            value={editedData.communityMember.email}
                                            onChange={(e) => handleInputChange('communityMember.email', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Shop/Farm Name"
                                            value={editedData.communityMember.shopOrFarmName}
                                            onChange={(e) => handleInputChange('communityMember.shopOrFarmName', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            multiline
                                            rows={3}
                                            value={editedData.communityMember.description}
                                            onChange={(e) => handleInputChange('communityMember.description', e.target.value)}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setEditDialogOpen(false)}
                        startIcon={<CancelIcon />}
                        disabled={updating}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSaveEdit}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={updating}
                    >
                        {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Displaing the User Own shared Post */}
            <UserOwnPostDisplaying />
        </Box>
    );
}