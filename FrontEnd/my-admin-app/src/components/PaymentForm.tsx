import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    FormControlLabel,
    Switch,
    Chip
} from '@mui/material';
import {
    Upload as UploadIcon,
    AttachFile as AttachFileIcon,
    Receipt as ReceiptIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import ApiConfig from '../utils/ApiConfig';

interface PaymentType {
    id: number;
    name: string;
}

interface PaymentFormData {
    paymentid: string;
    amount: string;
    note: string;
    payment_type_id: string;
    status: boolean;
    file: File | null;
    filetype: string;
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

interface PaymentFormProps {
    payment?: Payment;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
    loading?: boolean;
}

export default function PaymentForm({ payment, onSuccess, onError, loading = false }: PaymentFormProps) {
    const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
    const [paymentData, setPaymentData] = useState<PaymentFormData>({
        paymentid: '',
        amount: '',
        note: '',
        payment_type_id: '',
        status: false,
        file: null,
        filetype: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState('');
    const [localSuccess, setLocalSuccess] = useState('');

    // Initialize form data when payment prop changes
    useEffect(() => {
        if (payment) {
            setPaymentData({
                paymentid: payment.id.toString(),
                amount: payment.amount.toString(),
                note: payment.note || '',
                payment_type_id: payment.paymentType.id.toString(),
                status: payment.status,
                file: null,
                filetype: payment.filetype || ''
            });
        }
    }, [payment]);

    // Fetch payment types on component mount
    useEffect(() => {
        const fetchPaymentTypes = async () => {
            try {
                const response = await fetch(`${ApiConfig.Domain}/payment-types`);
                if (response.ok) {
                    const types = await response.json();
                    setPaymentTypes(types);
                } else {
                    // Fallback payment types if API not available
                    setPaymentTypes([
                        { id: 1, name: 'Cash' },
                        { id: 2, name: 'Bank Transfer' },
                        { id: 3, name: 'Credit Card' },
                        { id: 4, name: 'Digital Wallet' }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching payment types:', error);
                setPaymentTypes([
                    { id: 1, name: 'Cash' },
                    { id: 2, name: 'Bank Transfer' },
                    { id: 3, name: 'Credit Card' },
                    { id: 4, name: 'Digital Wallet' }
                ]);
            }
        };

        fetchPaymentTypes();
    }, []);

    const handleInputChange = (field: keyof PaymentFormData, value: string | File | null | boolean) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }));
        setLocalError('');
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
            const fileType = file.type;
            
            if (!allowedTypes.includes(fileType)) {
                setLocalError('Please upload only PDF, PNG, JPG, or JPEG files.');
                return;
            }

            const filetype = fileType === 'application/pdf' ? 'pdf' : 
                           fileType === 'image/png' ? 'png' :
                           fileType === 'image/jpeg' ? 'jpeg' : 'jpg';

            setPaymentData(prev => ({
                ...prev,
                file: file,
                filetype: filetype
            }));
        } else {
            setPaymentData(prev => ({
                ...prev,
                file: null,
                filetype: ''
            }));
        }
        setLocalError('');
    };

    const handleDownloadPaymentFile = async (paymentId: number) => {
        try {
            const response = await fetch(`${ApiConfig.Domain}/payment/file/getbyid?id=${paymentId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `payment_receipt_${paymentId}`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('pdf')) {
                    filename += '.pdf';
                } else if (contentType?.includes('image')) {
                    filename += '.jpg';
                }
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setLocalSuccess('Payment receipt downloaded successfully!');
            if (onSuccess) onSuccess('Payment receipt downloaded successfully!');
            setTimeout(() => setLocalSuccess(''), 3000);

        } catch (error) {
            console.error('Error downloading payment file:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to download payment receipt.';
            setLocalError(errorMessage);
            if (onError) onError(errorMessage);
        }
    };

    const validateForm = (): boolean => {
        if (!paymentData.paymentid) {
            setLocalError('Please select a payment to update.');
            return false;
        }

        if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
            setLocalError('Please enter a valid amount.');
            return false;
        }
        
        if (!paymentData.note.trim()) {
            setLocalError('Please enter a note.');
            return false;
        }

        if (!paymentData.payment_type_id) {
            setLocalError('Please select a payment type.');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setLocalError('');

        try {
            const formData = new FormData();
            
            formData.append('paymentid', paymentData.paymentid);
            formData.append('amount', paymentData.amount);
            formData.append('note', paymentData.note);
            formData.append('paymentTypeId', paymentData.payment_type_id);
            formData.append('status', paymentData.status.toString());
            
            if (paymentData.file) {
                formData.append('file', paymentData.file);
                formData.append('filetype', paymentData.filetype);
            } else if (paymentData.filetype) {
                formData.append('filetype', paymentData.filetype);
            }

            const response = await fetch(`${ApiConfig.Domain}/payment/updatepayment`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update payment: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const successMessage = 'Payment updated successfully!';
            setLocalSuccess(successMessage);
            if (onSuccess) onSuccess(successMessage);
            setTimeout(() => setLocalSuccess(''), 3000);

        } catch (error) {
            console.error('Error updating payment:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update payment.';
            setLocalError(errorMessage);
            if (onError) onError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        if (payment) {
            setPaymentData({
                paymentid: payment.id.toString(),
                amount: payment.amount.toString(),
                note: payment.note || '',
                payment_type_id: payment.paymentType.id.toString(),
                status: payment.status,
                file: null,
                filetype: payment.filetype || ''
            });
        }
        setLocalError('');
        setLocalSuccess('');
    };

    if (!payment) {
        return (
            <Box>
                <Typography variant="h6" gutterBottom>
                    💳 Payment Information
                </Typography>
                <Alert severity="warning">
                    No payment record found. Payment records are created automatically when deals are confirmed and delivery is set up.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                💳 Payment Information
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Payment Update:</strong> Payment records are automatically created when deals are confirmed. 
                    Update the payment information below.
                </Typography>
            </Alert>

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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Current Payment Record */}
                <Box sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(33, 150, 243, 0.05)', 
                    borderRadius: 2,
                    border: '1px solid rgba(33, 150, 243, 0.2)'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Current Payment Record
                        </Typography>
                        {(payment.filetype || payment.file) && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownloadPaymentFile(payment.id)}
                                sx={{
                                    ml: 2,
                                    minWidth: 'auto',
                                    px: 2,
                                    fontSize: '0.75rem',
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                        borderColor: '#115293',
                                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                                    }
                                }}
                            >
                                Download Receipt
                            </Button>
                        )}
                    </Box>
                    
                    <Typography variant="body2">
                        <strong>Payment ID:</strong> {payment.id}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Current Amount:</strong> Rs. {payment.amount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Status:</strong> {payment.status ? 'Paid' : 'Pending'}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Payment Type:</strong> {payment.paymentType.name}
                    </Typography>
                    {payment.note && (
                        <Typography variant="body2">
                            <strong>Note:</strong> {payment.note}
                        </Typography>
                    )}
                    
                    {(payment.filetype || payment.file) ? (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2">
                                <strong>Receipt:</strong> {payment.filetype?.toUpperCase() || 'File'} available
                            </Typography>
                            <Chip
                                label="Download Available"
                                color="success"
                                size="small"
                                icon={<AttachFileIcon />}
                                onClick={() => handleDownloadPaymentFile(payment.id)}
                                sx={{ cursor: 'pointer' }}
                            />
                        </Box>
                    ) : (
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label="No Receipt Uploaded"
                                color="default"
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    )}
                </Box>

                {/* Payment Form Fields */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Amount (LKR)"
                        type="number"
                        variant="outlined"
                        value={paymentData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        required
                        disabled={isSubmitting || loading}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{ width: "48%" }}
                        helperText="Enter the payment amount"
                    />
                    
                    <TextField
                        select
                        label="Payment Type"
                        value={paymentData.payment_type_id}
                        onChange={(e) => handleInputChange('payment_type_id', e.target.value)}
                        required
                        disabled={isSubmitting || loading}
                        sx={{ width: "48%" }}
                        helperText="Select payment method"
                    >
                        {paymentTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id.toString()}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* Payment Status Toggle */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">Payment Status:</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={paymentData.status}
                                onChange={(e) => handleInputChange('status', e.target.checked)}
                                disabled={isSubmitting || loading}
                                color="success"
                            />
                        }
                        label={paymentData.status ? 'Paid' : 'Pending'}
                    />
                </Box>

                <TextField
                    label="Payment Note"
                    multiline
                    rows={3}
                    variant="outlined"
                    value={paymentData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    required
                    disabled={isSubmitting || loading}
                    helperText="Add payment details or reference number"
                    fullWidth
                />

                {/* File Upload Section */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Payment Receipt {paymentData.filetype ? '(Update File)' : '(Upload File)'}
                    </Typography>
                    {paymentData.filetype && !paymentData.file && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Current file type: {paymentData.filetype.toUpperCase()}. 
                            Upload a new file to replace it.
                        </Alert>
                    )}
                    
                    <Box sx={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: 2, 
                        p: 3, 
                        textAlign: 'center',
                        bgcolor: 'grey.50'
                    }}>
                        <input
                            accept=".pdf,.png,.jpg,.jpeg"
                            style={{ display: 'none' }}
                            id="payment-file-upload"
                            type="file"
                            onChange={handleFileChange}
                            disabled={isSubmitting || loading}
                        />
                        <label htmlFor="payment-file-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<UploadIcon />}
                                disabled={isSubmitting || loading}
                            >
                                {paymentData.filetype ? 'Update Receipt' : 'Upload Receipt'}
                            </Button>
                        </label>
                        {paymentData.file && (
                            <Box sx={{ mt: 2 }}>
                                <Chip
                                    icon={<AttachFileIcon />}
                                    label={`${paymentData.file.name} (${paymentData.filetype})`}
                                    onDelete={() => handleInputChange('file', null)}
                                    color="primary"
                                />
                            </Box>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Supported formats: PDF, PNG, JPG, JPEG (Max 10MB)
                        </Typography>
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={handleReset}
                        disabled={isSubmitting || loading}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || loading}
                        startIcon={<ReceiptIcon />}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Payment'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
