// src/components/MoreInfodeal.tsx

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Avatar,
    Rating,
    Chip,
    Divider,
    Card,
    CardContent,
    IconButton,
    Stack,
    TextField
} from '@mui/material';
import {
    Close as CloseIcon,
    Phone as PhoneIcon,
    Message as MessageIcon,
    Verified as VerifiedIcon,
    LocalShipping as ShippingIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

interface MoreInfoDealProps {
    open: boolean;
    onClose: () => void;
    dealId: number;
}

interface DealDetailsType {
    id: number;
    dealerName: string;
    avatar: string;
    rating: number;
    soldCount: number;
    location: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    status: 'pending' | 'accepted' | 'rejected';
    description: string;
    expectedDeliveryDate: string;
    paymentMethod: string;
    qualityCertifications: string[];
    contactPhone: string;
}

// Sample data - in a real app this would be fetched based on dealId
const getDealDetails = (id: number): DealDetailsType => {
    return {
        id,
        dealerName: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4.8,
        soldCount: 56,
        location: "Kandy, Sri Lanka",
        quantity: 50,
        pricePerUnit: 110,
        totalPrice: 5500,
        status: "accepted",
        description: "Premium quality organic vegetables grown without pesticides. Perfect for restaurants and health food stores.",
        expectedDeliveryDate: "2023-07-15",
        paymentMethod: "Bank Transfer/Cash on Delivery",
        qualityCertifications: ["Organic Certified", "ISO 22000", "GMP"],
        contactPhone: "+94 76 123 4567"
    };
};

export default function MoreInfoDeal({ open, onClose, dealId }: MoreInfoDealProps) {
    const [dealDetails] = useState<DealDetailsType>(getDealDetails(dealId));
    const [messageText, setMessageText] = useState('');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSendMessage = () => {
        if (messageText.trim()) {
            // Implement message sending logic here
            alert(`Message sent: ${messageText}`);
            setMessageText('');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'white'
            }}>
                <Typography variant="h6">Deal Details</Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Dealer Info Section */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                src={dealDetails.avatar}
                                sx={{ width: 64, height: 64, mr: 2 }}
                            />
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h6">{dealDetails.dealerName}</Typography>
                                    <VerifiedIcon color="primary" fontSize="small" />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating value={dealDetails.rating} precision={0.1} readOnly size="small" />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        ({dealDetails.rating}) • {dealDetails.soldCount} sales
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {dealDetails.location}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    {/* Deal Status */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">Deal Status</Typography>
                            <Chip
                                label={dealDetails.status.toUpperCase()}
                                color={
                                    dealDetails.status === 'accepted' ? 'success' :
                                        dealDetails.status === 'rejected' ? 'error' : 'warning'
                                }
                            />
                        </Box>
                    </Grid>

                    {/* Deal Details Cards */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    <AttachMoneyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    Order Details
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Quantity:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">{dealDetails.quantity} kg</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Price per Unit:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">Rs. {dealDetails.pricePerUnit}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Total Price:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Rs. {dealDetails.totalPrice}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">{dealDetails.paymentMethod}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    <ShippingIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    Delivery Information
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Expected Delivery:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">{formatDate(dealDetails.expectedDeliveryDate)}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Quality Certifications:</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                            {dealDetails.qualityCertifications.map((cert, index) => (
                                                <Chip key={index} label={cert} size="small" />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Description</Typography>
                                <Typography variant="body2">{dealDetails.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Contact Section */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Contact Dealer</Typography>
                                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PhoneIcon />}
                                        href={`tel:${dealDetails.contactPhone}`}
                                    >
                                        Call
                                    </Button>
                                    <Button variant="contained" startIcon={<MessageIcon />}>
                                        Chat
                                    </Button>
                                </Stack>
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Send a message"
                                        placeholder="Type your message here..."
                                        multiline
                                        rows={2}
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={handleSendMessage}
                                            disabled={!messageText.trim()}
                                        >
                                            Send
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">Close</Button>
                <Button
                    variant="contained"
                    color={dealDetails.status === 'accepted' ? 'primary' : 'success'}
                    disabled={dealDetails.status === 'rejected'}
                >
                    {dealDetails.status === 'accepted' ? 'View Contract' : 'Accept Deal'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}