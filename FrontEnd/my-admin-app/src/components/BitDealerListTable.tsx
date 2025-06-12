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
}

export default function BitDealerListTable({ postId, bitDetails: propBitDetails }: BitDealerListTableProps) {
    const [page, setPage] = React.useState(1);
    const [moreInfoOpen, setMoreInfoOpen] = React.useState(false);
    const [selectedDealId, setSelectedDealId] = React.useState<number | null>(null);
    const [bitDetails, setBitDetails] = React.useState<BitDetail[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [selectedBitDetail, setSelectedBitDetail] = React.useState<BitDetail | null>(null);

    const dealersPerPage = 4;

    // Fetch bit details from API
    const fetchBitDetails = async () => {
        if (!postId) {
            console.warn('fetchBitDetails called without a valid postId');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Fetching bit details for post ID:', postId);
            const response = await fetch(`http://localhost:8080/bitdetails/getbypostid?postid=${postId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: BitDetail[] = await response.json();
            console.log('Fetched bit details:', data);
            setBitDetails(data);
        } catch (err) {
            console.error('Error fetching bit details:', err);
            setError('Failed to load bid details. Please try again.');
            setBitDetails([]);
        } finally {
            setLoading(false);
        }
    };

    // Use prop bitDetails first, then fetch if not available
    React.useEffect(() => {
        if (propBitDetails && propBitDetails.length > 0) {
            console.log('Using provided bitDetails:', propBitDetails);
            setBitDetails(propBitDetails);
            setLoading(false);
        } else if (postId) {
            console.log('No bitDetails provided, fetching from API...');
            fetchBitDetails();
        } else {
            console.log('No bitDetails available');
            setBitDetails([]);
            setLoading(false);
        }
    }, [postId, propBitDetails]);

    // Listen for a custom event to refresh bit details
    React.useEffect(() => {
        const handler = async (event: CustomEvent) => {
            if (event.detail && event.detail.newBid) {
                console.log('append-new-bid event received:', event.detail.newBid);
                await fetchBitDetails(); // Re-fetch bit details after a new bid is added
            }
        };
        window.addEventListener('append-new-bid', handler as EventListener);
        return () => window.removeEventListener('append-new-bid', handler as EventListener);
    }, []);

    const pageCount = Math.ceil(bitDetails.length / dealersPerPage);
    const indexOfLastDealer = page * dealersPerPage;
    const indexOfFirstDealer = indexOfLastDealer - dealersPerPage;
    const currentBitDetails = bitDetails.slice(indexOfFirstDealer, indexOfLastDealer);

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
                                    borderColor: bitDetail.conformedstate ? 'success.main' : 'warning.main'
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(bitDetail.user.name)}&background=4caf50&color=white&size=128`}
                                                alt={bitDetail.user.name}
                                                sx={{ width: 50, height: 50, mr: 2 }}
                                            >
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" component="div">
                                                    {bitDetail.user.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    @{bitDetail.user.username}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={bitDetail.conformedstate ? 'Accepted' : 'Pending'}
                                            color={bitDetail.conformedstate ? 'success' : 'warning'}
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
                                    <Typography variant="caption" color="text.secondary">
                                        Phone: {bitDetail.user.mobileNumber}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
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
                />
            )}
        </>
    );
}