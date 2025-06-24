// src/components/BitDealerListTable.tsx

import * as React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    Rating,
    Chip,
    Button,
    Divider,
    Stack,
    Pagination,
    Skeleton,
    Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import PersonIcon from '@mui/icons-material/Person';
import MoreInfoDeal from './MoreInfodeal';
import ApiConfig from '../utils/ApiConfig';

// Interface for bit details from API
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

interface BitDealerListTableProps {
    postId?: number;
    bitDetails?: BitDetail[];
    key?: number; // Add key prop for forcing refresh
    onBidAccepted?: () => void; // Add callback prop
}

export default function BitDealerListTable({ 
    postId, 
    bitDetails: propBitDetails, 
    onBidAccepted 
}: BitDealerListTableProps) {
    const [page, setPage] = React.useState(1);
    const [moreInfoOpen, setMoreInfoOpen] = React.useState(false);
    const [selectedDealId, setSelectedDealId] = React.useState<number | null>(null);
    const [bitDetails, setBitDetails] = React.useState<BitDetail[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [selectedBitDetail, setSelectedBitDetail] = React.useState<BitDetail | null>(null);

    const dealersPerPage = 4;

    // Optimize useEffect to prevent duplicate calls
    React.useEffect(() => {
        if (propBitDetails && propBitDetails.length >= 0) {
            console.log('Using provided bitDetails:', propBitDetails);
            setBitDetails(propBitDetails);
            setLoading(false);
            setPage(1); // Reset to first page when data updates
        } else if (postId && !propBitDetails) {
            console.log('Fetching fresh bitDetails from API...');
            fetchBitDetails();
        } else {
            console.log('No bitDetails available');
            setBitDetails([]);
            setLoading(false);
        }
    }, [postId, JSON.stringify(propBitDetails)]); // Use JSON.stringify to prevent unnecessary re-renders

    const fetchBitDetails = async () => {
        if (!postId) return;

        setLoading(true);
        setError('');

        try {
            console.log('Fetching bit details for post ID:', postId);
            
            const response = await fetch(`${ApiConfig.Domain}/sharedpost/${postId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const postData = await response.json();
            console.log('Fetched post data:', postData);
            
            if (postData.bitDetails && Array.isArray(postData.bitDetails)) {
                setBitDetails(postData.bitDetails);
                console.log('Bit details found:', postData.bitDetails.length);
            } else {
                setBitDetails([]);
                console.log('No bit details found');
            }
        } catch (err) {
            console.error('Error fetching bit details:', err);
            setError('Failed to load bid details. Please try again.');
            setBitDetails([]);
        } finally {
            setLoading(false);
        }
    };

    const pageCount = Math.ceil(bitDetails.length / dealersPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleMoreInfoClick = (bitDetailId: number) => {
        const bitDetail = bitDetails.find(bid => bid.id === bitDetailId);
        if (bitDetail) {
            setSelectedBitDetail(bitDetail);
            setSelectedDealId(bitDetailId);
            setMoreInfoOpen(true);
        }
    };

    const handleMoreInfoClose = () => {
        setMoreInfoOpen(false);
        setSelectedBitDetail(null);
        setSelectedDealId(null);
    };

    // Handle when bid is accepted from the MoreInfoDeal dialog
    const handleBidAccepted = () => {
        // Refresh the bit details by refetching or calling parent callback
        if (onBidAccepted) {
            onBidAccepted();
        }
        
        // Also refresh local data if we have postId
        if (postId) {
            fetchBitDetails();
        }
        
        // Close the dialog
        handleMoreInfoClose();
    };

    // Get current dealers for pagination
    const indexOfLastDealer = page * dealersPerPage;
    const indexOfFirstDealer = indexOfLastDealer - dealersPerPage;
    const currentBitDetails = bitDetails.slice(indexOfFirstDealer, indexOfLastDealer);

    // Function to get user avatar
    const getUserAvatar = (user: BitDetail['user']): string => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4caf50&color=white&size=128`;
    };

    // Function to get status based on conformedstate
    const getStatus = (conformedstate: boolean): 'accepted' | 'pending' => {
        return conformedstate ? 'accepted' : 'pending';
    };

    // Function to get status color
    const getStatusColor = (conformedstate: boolean) => {
        return conformedstate ? 'success' : 'warning';
    };

    // Loading skeleton
    if (loading) {
        return (
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bid Dealer Requests
                </Typography>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((index) => (
                        <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Skeleton variant="text" width="80%" height={24} />
                                            <Skeleton variant="text" width="60%" height={20} />
                                        </Box>
                                    </Box>
                                    <Skeleton variant="text" width="100%" height={20} />
                                    <Skeleton variant="text" width="100%" height={20} />
                                    <Skeleton variant="text" width="60%" height={20} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bid Dealer Requests
                </Typography>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="outlined" onClick={fetchBitDetails}>
                    Retry
                </Button>
            </Box>
        );
    }

    // No bids state
    if (bitDetails.length === 0) {
        return (
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bid Dealer Requests
                </Typography>
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                }}>
                    <ShoppingBasketIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No bids yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Be the first to place a bid on this post!
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bid Dealer Requests ({bitDetails.length})
                </Typography>

                <Grid container spacing={3}>
                    {currentBitDetails.map((bitDetail) => (
                        <Grid item xs={12} sm={6} md={6} lg={6} key={bitDetail.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderLeft: 4,
                                    borderColor: getStatusColor(bitDetail.conformedstate) + '.main'
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={getUserAvatar(bitDetail.user)}
                                                alt={bitDetail.user.name}
                                                sx={{ width: 50, height: 50, mr: 2 }}
                                            >
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" component="div">
                                                    {bitDetail.user.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Rating
                                                        value={4.0}
                                                        precision={0.5}
                                                        size="small"
                                                        readOnly
                                                    />
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                        @{bitDetail.user.username}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={getStatus(bitDetail.conformedstate)}
                                            color={getStatusColor(bitDetail.conformedstate)}
                                            size="small"
                                        />
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {bitDetail.user.city}
                                                {bitDetail.deliverylocation && ` → ${bitDetail.deliverylocation}`}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ShoppingBasketIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                Quantity: {bitDetail.needamount} kg
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Price per Unit: Rs. {bitDetail.bitrate.toFixed(2)}
                                            </Typography>
                                            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                                Total: Rs. {(bitDetail.needamount * bitDetail.bitrate).toFixed(2)}
                                            </Typography>
                                        </Box>

                                        {bitDetail.bitdetailscol && (
                                            <Box sx={{ 
                                                bgcolor: 'grey.100', 
                                                p: 1, 
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'grey.200'
                                            }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Contact Details:
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                    {bitDetail.bitdetailscol}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>

                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocalShippingIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Phone: {bitDetail.user.mobileNumber}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<InfoIcon />}
                                        onClick={() => handleMoreInfoClick(bitDetail.id)}
                                    >
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {pageCount > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Box>

            {/* More Info Dialog */}
            {moreInfoOpen && selectedDealId && selectedBitDetail && (
                <MoreInfoDeal
                    open={moreInfoOpen}
                    onClose={handleMoreInfoClose}
                    dealId={selectedDealId}
                    bitDetail={selectedBitDetail}
                    sharedPostId={postId} // Pass the shared post ID
                    onBidAccepted={handleBidAccepted} // Pass the callback
                />
            )}
        </>
    );
}