// src/components/MoreInfodeal.tsx

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    IconButton,
    Stack,
    Rating,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationOnIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    MonetizationOn as MonetizationOnIcon,
    LocalShipping as LocalShippingIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    ContactPhone as ContactPhoneIcon
} from '@mui/icons-material';
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

interface MoreInfoDealProps {
    open: boolean;
    onClose: () => void;
    dealId: number;
    bitDetail?: BitDetail;
    sharedPostId?: number; // Add sharedPostId prop
    onBidAccepted?: () => void; // Add callback for when bid is accepted
}

export default function MoreInfoDeal({ 
    open, 
    onClose, 
    dealId, 
    bitDetail, 
    sharedPostId,
    onBidAccepted 
}: MoreInfoDealProps) {
    // Add state for handling accept bid operation
    const [isAccepting, setIsAccepting] = useState(false);
    const [acceptError, setAcceptError] = useState<string>('');
    const [acceptSuccess, setAcceptSuccess] = useState<string>('');

    // Function to get user avatar
    const getUserAvatar = (user: BitDetail['user']): string => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4caf50&color=white&size=128`;
    };

    // Function to get user roles as string
    const getUserRoles = (roleList: Array<{id: number, name: string}>): string => {
        return roleList.map(role => role.name).join(', ');
    };

    // Function to get status info
    const getStatusInfo = (conformedstate: boolean) => {
        return conformedstate 
            ? { label: 'Accepted', color: 'success' as const, icon: <CheckCircleIcon /> }
            : { label: 'Pending', color: 'warning' as const, icon: <ScheduleIcon /> };
    };

    // Function to handle accepting the bid
    const handleAcceptBid = async () => {
        if (!bitDetail || !sharedPostId) {
            setAcceptError('Missing required information to accept bid');
            return;
        }

        setIsAccepting(true);
        setAcceptError('');
        setAcceptSuccess('');

        try {
            // Get the delivery location from the bid details
            const deliveryLocation = bitDetail.deliverylocation || bitDetail.user.city;

            const requestBody = {
                location: deliveryLocation
            };

            console.log('Accepting bid with data:', {
                bitId: bitDetail.id,
                sharedPostId: sharedPostId,
                requestBody
            });

            const response = await fetch(
                `${ApiConfig.Domain}/sharedpost/updatebitconfirmation?bitid=${bitDetail.id}&sharedpostid=${sharedPostId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to accept bid: ${errorText}`);
            }

            // Handle both JSON and text responses
            let result;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
                console.log('Bid accepted successfully (JSON):', result);
            } else {
                result = await response.text();
                console.log('Bid accepted successfully (Text):', result);
            }

            setAcceptSuccess('Bid accepted successfully! The deal has been confirmed.');
            
            // Call the callback to refresh the parent data
            if (onBidAccepted) {
                onBidAccepted();
            }

            // Auto-close after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error accepting bid:', error);
            setAcceptError(error instanceof Error ? error.message : 'Failed to accept bid. Please try again.');
        } finally {
            setIsAccepting(false);
        }
    };

    // Function to handle rejecting the bid
    const handleRejectBid = async () => {
        if (!bitDetail) {
            setAcceptError('Missing bid information');
            return;
        }

        setIsAccepting(true);
        setAcceptError('');

        try {
            // You can implement reject functionality here if needed
            // For now, just show a message
            setAcceptError('Reject functionality not implemented yet');
        } catch (error) {
            console.error('Error rejecting bid:', error);
            setAcceptError('Failed to reject bid');
        } finally {
            setIsAccepting(false);
        }
    };

    if (!bitDetail) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <Typography>No bid details available.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const statusInfo = getStatusInfo(bitDetail.conformedstate);
    const user = bitDetail.user;
    const communityMember = user.communityMember;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 2
                }}
            >
                <Box
                    component="span"
                    sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        lineHeight: 1.6
                    }}
                >
                    Bid Details - #{dealId}
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                    disabled={isAccepting}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Success/Error Messages */}
                {acceptSuccess && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {acceptSuccess}
                    </Alert>
                )}
                {acceptError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {acceptError}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Bidder Information */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={2} sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar
                                        src={getUserAvatar(user)}
                                        alt={user.name}
                                        sx={{ width: 80, height: 80, mr: 2 }}
                                    >
                                        <PersonIcon sx={{ fontSize: 40 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {user.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            @{user.username}
                                        </Typography>
                                        <Rating value={4.2} precision={0.1} size="small" readOnly sx={{ mt: 0.5 }} />
                                        <Box sx={{ mt: 1 }}>
                                            <Chip
                                                label={getUserRoles(user.roleList)}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            <strong>Phone:</strong> {user.mobileNumber}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            <strong>Location:</strong> {user.city}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.2 }} />
                                        <Typography variant="body2">
                                            <strong>Address:</strong> {user.address}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            <strong>NIC:</strong> {user.nic}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Bid Information */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={2} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Bid Information
                                </Typography>

                                <Stack spacing={2}>
                                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <MonetizationOnIcon sx={{ mr: 1, color: 'success.main' }} />
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Price Details
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            Rate per Unit: <strong>Rs. {bitDetail.bitrate.toFixed(2)}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            Quantity: <strong>{bitDetail.needamount} kg</strong>
                                        </Typography>
                                        <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                                            Total: Rs. {(bitDetail.bitrate * bitDetail.needamount).toFixed(2)}
                                        </Typography>
                                    </Paper>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {statusInfo.icon}
                                        <Typography variant="body2">
                                            <strong>Status:</strong>
                                        </Typography>
                                        <Chip
                                            label={statusInfo.label}
                                            color={statusInfo.color}
                                            size="small"
                                        />
                                    </Box>

                                    {bitDetail.deliverylocation && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocalShippingIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                <strong>Delivery Location:</strong> {bitDetail.deliverylocation}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Highlight the delivery location that will be used for the API call */}
                                    <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <LocationOnIcon sx={{ mr: 1, color: 'success.main' }} />
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Delivery Address
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            {bitDetail.deliverylocation || bitDetail.user.city}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            This location will be used for delivery confirmation
                                        </Typography>
                                    </Paper>

                                    {bitDetail.bitdetailscol && (
                                        <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <ContactPhoneIcon sx={{ mr: 1, color: 'info.main' }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Contact Details & Notes
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {bitDetail.bitdetailscol}
                                            </Typography>
                                        </Paper>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Community Member Information (if available) */}
                    {communityMember && (
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Community Member Details
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.5}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        <strong>Full Name:</strong> {communityMember.firstName} {communityMember.lastName}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        <strong>Email:</strong> {communityMember.email}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        <strong>Mobile:</strong> {communityMember.mobileNumber}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        <strong>Shop/Farm:</strong> {communityMember.shopOrFarmName}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.5}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        <strong>City:</strong> {communityMember.city}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.2 }} />
                                                    <Typography variant="body2">
                                                        <strong>Address:</strong> {communityMember.address}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        <strong>NIC:</strong> {communityMember.nic}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        {communityMember.description && (
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                                                    <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', mt: 0.2 }} />
                                                    <Typography variant="body2">
                                                        <strong>Description:</strong> {communityMember.description}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ minWidth: 100 }}
                    disabled={isAccepting}
                >
                    Close
                </Button>
                {!bitDetail.conformedstate && (
                    <>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ minWidth: 100 }}
                            onClick={handleRejectBid}
                            disabled={isAccepting}
                        >
                            {isAccepting ? <CircularProgress size={20} /> : 'Reject'}
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ minWidth: 100 }}
                            onClick={handleAcceptBid}
                            disabled={isAccepting}
                            startIcon={isAccepting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                        >
                            {isAccepting ? 'Accepting...' : 'Accept Bid'}
                        </Button>
                    </>
                )}
                {bitDetail.conformedstate && (
                    <Chip
                        label="Bid Accepted"
                        color="success"
                        icon={<CheckCircleIcon />}
                    />
                )}
            </DialogActions>
        </Dialog>
    );
}