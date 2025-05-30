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
    Pagination
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MoreInfoDeal from './MoreInfodeal';

// Interface for dealer data
interface DealerData {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    soldCount: number;
    location: string;
    quantity: number;
    pricePerUnit: number;
    status: 'pending' | 'accepted' | 'rejected';
}

// Create data for dealers
const dealers: DealerData[] = [
    { id: 1, name: "John Smith", avatar: "https://randomuser.me/api/portraits/men/1.jpg", rating: 4.5, soldCount: 127, location: "Colombo", quantity: 25, pricePerUnit: 120, status: "pending" },
    { id: 2, name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/2.jpg", rating: 3.8, soldCount: 56, location: "Kandy", quantity: 50, pricePerUnit: 110, status: "accepted" },
    { id: 3, name: "Michael Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg", rating: 5.0, soldCount: 243, location: "Galle", quantity: 30, pricePerUnit: 115, status: "rejected" },
    { id: 4, name: "Emma Wilson", avatar: "https://randomuser.me/api/portraits/women/4.jpg", rating: 4.2, soldCount: 78, location: "Jaffna", quantity: 40, pricePerUnit: 125, status: "pending" },
    { id: 5, name: "David Lee", avatar: "https://randomuser.me/api/portraits/men/5.jpg", rating: 3.5, soldCount: 42, location: "Negombo", quantity: 60, pricePerUnit: 105, status: "accepted" },
    { id: 6, name: "Lisa Chen", avatar: "https://randomuser.me/api/portraits/women/6.jpg", rating: 4.7, soldCount: 153, location: "Matara", quantity: 35, pricePerUnit: 118, status: "pending" }
];

export default function BitDealerListCards() {
    const [page, setPage] = React.useState(1);
    const [moreInfoOpen, setMoreInfoOpen] = React.useState(false);
    const [selectedDealId, setSelectedDealId] = React.useState<number | null>(null);

    const dealersPerPage = 4;
    const pageCount = Math.ceil(dealers.length / dealersPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleMoreInfoClick = (dealId: number) => {
        setSelectedDealId(dealId);
        setMoreInfoOpen(true);
    };

    const handleMoreInfoClose = () => {
        setMoreInfoOpen(false);
    };

    // Get current dealers for pagination
    const indexOfLastDealer = page * dealersPerPage;
    const indexOfFirstDealer = indexOfLastDealer - dealersPerPage;
    const currentDealers = dealers.slice(indexOfFirstDealer, indexOfLastDealer);

    return (
        <>
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bid Dealer Requests
                </Typography>

                <Grid container spacing={3}>
                    {currentDealers.map((dealer) => (
                        <Grid item xs={12} sm={6} md={6} lg={6} key={dealer.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderLeft: 4,
                                    borderColor:
                                        dealer.status === 'accepted' ? 'success.main' :
                                            dealer.status === 'rejected' ? 'error.main' : 'warning.main'
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={dealer.avatar}
                                                alt={dealer.name}
                                                sx={{ width: 50, height: 50, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography variant="subtitle1" component="div">
                                                    {dealer.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Rating
                                                        value={dealer.rating}
                                                        precision={0.5}
                                                        size="small"
                                                        readOnly
                                                    />
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                        ({dealer.soldCount} sold)
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={dealer.status}
                                            color={
                                                dealer.status === 'accepted' ? 'success' :
                                                    dealer.status === 'rejected' ? 'error' : 'warning'
                                            }
                                            size="small"
                                        />
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">{dealer.location}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ShoppingBasketIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                Quantity: {dealer.quantity} kg
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Price per Unit: Rs. {dealer.pricePerUnit}
                                            </Typography>
                                            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                                Total: Rs. {dealer.quantity * dealer.pricePerUnit}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>

                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocalShippingIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Est. delivery: 3-5 days
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<InfoIcon />}
                                        onClick={() => handleMoreInfoClick(dealer.id)}
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
            {moreInfoOpen && selectedDealId && (
                <MoreInfoDeal
                    open={moreInfoOpen}
                    onClose={handleMoreInfoClose}
                    dealId={selectedDealId}
                />
            )}
        </>
    );
}