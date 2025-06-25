import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import {
    LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import ApiConfig from '../utils/ApiConfig';

interface DeliveryUpdateData {
    trackingNumber: string;
    location: string;
    currentPackageLocation: string;
    deliveryCompany: string;
    deliveryStatus: number;
}

interface DeliveryStatus {
    id: number;
    name: string;
}

interface DeliveryData {
    id: number;
    trackingNumber: string;
    location: string;
    currentPackageLocation: string;
    deliveryCompany: string;
    description: string;
    currentStatus: DeliveryStatus;
}

interface DeliveryStatusFormProps {
    postId?: number;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
    onDeliveryUpdated?: () => void;
    loading?: boolean;
}

const DELIVERY_STATUSES = [
    { id: 1, name: 'Order Placed' },
    { id: 2, name: 'Order Confirmed' },
    { id: 3, name: 'Processing' },
    { id: 4, name: 'Ready for Dispatch' },
    { id: 5, name: 'Out for Delivery' },
    { id: 6, name: 'Delivered' },
    { id: 7, name: 'Shipped' },
    { id: 8, name: 'In Transit' }
];

export default function DeliveryStatusForm({ 
    postId, 
    onSuccess, 
    onError, 
    onDeliveryUpdated,
    loading = false 
}: DeliveryStatusFormProps) {
    const [deliveryUpdateData, setDeliveryUpdateData] = useState<DeliveryUpdateData>({
        trackingNumber: '',
        location: '',
        currentPackageLocation: '',
        deliveryCompany: '',
        deliveryStatus: 1
    });
    const [deliveryId, setDeliveryId] = useState<number | null>(null);
    const [existingDelivery, setExistingDelivery] = useState<DeliveryData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState('');
    const [localSuccess, setLocalSuccess] = useState('');
    const [isLoadingDelivery, setIsLoadingDelivery] = useState(false);

    // Fetch existing delivery data when component mounts or postId changes
    useEffect(() => {
        if (postId) {
            fetchExistingDelivery();
        }
    }, [postId]);

    const fetchExistingDelivery = async () => {
        if (!postId) return;

        try {
            setIsLoadingDelivery(true);
            setLocalError('');
            
            const response = await fetch(`${ApiConfig.Domain}/delivery/getbypostid?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: DeliveryData = await response.json();
                console.log('Fetched existing delivery data:', data);
                
                setExistingDelivery(data);
                setDeliveryId(data.id);
                
                // Pre-populate form with existing data
                setDeliveryUpdateData({
                    trackingNumber: data.trackingNumber || '',
                    location: data.location || '',
                    currentPackageLocation: data.currentPackageLocation || '',
                    deliveryCompany: data.deliveryCompany || '',
                    deliveryStatus: data.currentStatus?.id || 1
                });
            } else if (response.status === 404) {
                setExistingDelivery(null);
                setDeliveryId(null);
                setLocalError('No delivery record found for this post. Please create a delivery first.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching existing delivery:', err);
            setLocalError('Failed to load existing delivery information');
            setExistingDelivery(null);
            setDeliveryId(null);
        } finally {
            setIsLoadingDelivery(false);
        }
    };

    const handleInputChange = (field: keyof DeliveryUpdateData, value: string | number) => {
        setDeliveryUpdateData(prev => ({
            ...prev,
            [field]: value
        }));
        setLocalError('');
    };

    const validateForm = (): boolean => {
        if (!deliveryId) {
            setLocalError('No delivery record found. Cannot update delivery details.');
            return false;
        }

        if (!deliveryUpdateData.trackingNumber.trim()) {
            setLocalError('Please enter a tracking number.');
            return false;
        }
        
        if (!deliveryUpdateData.location.trim()) {
            setLocalError('Please enter delivery location.');
            return false;
        }

        if (!deliveryUpdateData.currentPackageLocation.trim()) {
            setLocalError('Please enter current package location.');
            return false;
        }

        if (!deliveryUpdateData.deliveryCompany.trim()) {
            setLocalError('Please enter delivery company.');
            return false;
        }

        if (!deliveryUpdateData.deliveryStatus) {
            setLocalError('Please select a delivery status.');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setLocalError('');

        try {
            const response = await fetch(`${ApiConfig.Domain}/delivery/update-all-details?deliveryId=${deliveryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deliveryUpdateData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update delivery details: ${errorText}`);
            }

            const successMessage = 'Delivery details updated successfully!';
            setLocalSuccess(successMessage);
            if (onSuccess) onSuccess(successMessage);
            
            // Call delivery updated callback to refresh parent data
            if (onDeliveryUpdated) onDeliveryUpdated();

            // Refresh the existing delivery data
            await fetchExistingDelivery();

            setTimeout(() => setLocalSuccess(''), 3000);

        } catch (error) {
            console.error('Error updating delivery details:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update delivery details.';
            setLocalError(errorMessage);
            if (onError) onError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        if (existingDelivery) {
            setDeliveryUpdateData({
                trackingNumber: existingDelivery.trackingNumber || '',
                location: existingDelivery.location || '',
                currentPackageLocation: existingDelivery.currentPackageLocation || '',
                deliveryCompany: existingDelivery.deliveryCompany || '',
                deliveryStatus: existingDelivery.currentStatus?.id || 1
            });
        } else {
            setDeliveryUpdateData({
                trackingNumber: '',
                location: '',
                currentPackageLocation: '',
                deliveryCompany: '',
                deliveryStatus: 1
            });
        }
        setLocalError('');
        setLocalSuccess('');
    };

    if (isLoadingDelivery) {
        return (
            <Box>
                <Typography variant="h6" gutterBottom>
                    🚚 Delivery Status Update
                </Typography>
                <Alert severity="info">
                    Loading existing delivery information...
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                🚚 Delivery Status Update
            </Typography>

            {existingDelivery && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        <strong>Updating Delivery ID:</strong> {deliveryId} | 
                        <strong> Current Status:</strong> {existingDelivery.currentStatus?.name || 'Unknown'}
                    </Typography>
                </Alert>
            )}

            {localSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {localSuccess}
                </Alert>
            )}

            {localError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {localError}
                </Alert>
            )}

            {!deliveryId && !isLoadingDelivery && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    No delivery record found for this post. Please ensure a delivery has been created first.
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Tracking Number"
                        variant="outlined"
                        value={deliveryUpdateData.trackingNumber}
                        onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                        required
                        disabled={isSubmitting || loading || !deliveryId}
                        sx={{ width: "48%" }}
                        helperText="Enter package tracking number"
                    />

                    <TextField
                        label="Delivery Company"
                        variant="outlined"
                        value={deliveryUpdateData.deliveryCompany}
                        onChange={(e) => handleInputChange('deliveryCompany', e.target.value)}
                        required
                        disabled={isSubmitting || loading || !deliveryId}
                        sx={{ width: "48%" }}
                        helperText="Name of delivery service"
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Delivery Location"
                        variant="outlined"
                        value={deliveryUpdateData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                        disabled={isSubmitting || loading || !deliveryId}
                        sx={{ width: "48%" }}
                        helperText="Final delivery destination"
                    />

                    <TextField
                        label="Current Package Location"
                        variant="outlined"
                        value={deliveryUpdateData.currentPackageLocation}
                        onChange={(e) => handleInputChange('currentPackageLocation', e.target.value)}
                        required
                        disabled={isSubmitting || loading || !deliveryId}
                        sx={{ width: "48%" }}
                        helperText="Where is the package currently located?"
                    />
                </Box>

                <FormControl fullWidth required>
                    <InputLabel id="delivery-status-label">Delivery Status</InputLabel>
                    <Select
                        labelId="delivery-status-label"
                        value={deliveryUpdateData.deliveryStatus}
                        label="Delivery Status"
                        onChange={(e) => handleInputChange('deliveryStatus', Number(e.target.value))}
                        disabled={isSubmitting || loading || !deliveryId}
                    >
                        {DELIVERY_STATUSES.map((status) => (
                            <MenuItem key={status.id} value={status.id}>
                                {status.id}. {status.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={handleReset}
                        disabled={isSubmitting || loading || !deliveryId}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={isSubmitting || loading || !deliveryId}
                        startIcon={<LocalShippingIcon />}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Delivery'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
