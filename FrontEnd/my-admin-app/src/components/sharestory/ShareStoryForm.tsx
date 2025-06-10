import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    CircularProgress,
    Avatar,
    Paper,
    InputLabel,
    FormControl
} from '@mui/material';
import {
    PhotoCamera,
    Send,
    Close,
    Image as ImageIcon
} from '@mui/icons-material';

interface SharePostFormProps {
    open: boolean;
    onClose: () => void;
    currentUser?: {
        id: number;
        name: string;
        username: string;
        profileImage?: string | null;
    } | null;
    onSuccess?: () => void;
}

interface FormData {
    title: string;
    description: string;
    image: File | null;
}

const ShareStoryForm: React.FC<SharePostFormProps> = ({
    open,
    onClose,
    currentUser,
    onSuccess
}) => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Reset form when dialog opens/closes
    React.useEffect(() => {
        if (!open) {
            setFormData({ title: '', description: '', image: null });
            setImagePreview(null);
            setError(null);
            setSuccess(false);
        }
    }, [open]);

    const handleInputChange = (field: keyof Omit<FormData, 'image'>) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({ ...prev, image: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return false;
        }
        if (!formData.image) {
            setError('Image is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const submitFormData = new FormData();
            submitFormData.append('title', formData.title.trim());
            submitFormData.append('description', formData.description.trim());
            submitFormData.append('image', formData.image!);

            const response = await fetch(ApiConfig.Domain+'/sharestory/upload', {
                method: 'POST',
                body: submitFormData,
            });

            if (response.ok) {
                const result = await response.text();
                console.log('Upload successful:', result);
                setSuccess(true);

                // Show success message briefly then close
                setTimeout(() => {
                    onClose();
                    onSuccess?.();
                }, 1500);
            } else {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.error('Error uploading story:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload story');
        } finally {
            setLoading(false);
        }
    };

    const getUserProfileImage = () => {
        if (!currentUser?.profileImage) return null;

        if (currentUser.profileImage.startsWith('data:image')) {
            return currentUser.profileImage;
        }

        return `data:image/jpeg;base64,${currentUser.profileImage}`;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                backgroundColor: '#2e7d32',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={getUserProfileImage() || undefined}
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#1b5e20'
                        }}
                    >
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="div">
                            Share Your Story
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {currentUser?.name || 'Unknown User'}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        minWidth: 'auto',
                        p: 1
                    }}
                >
                    <Close />
                </Button>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {success ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 4,
                        textAlign: 'center'
                    }}>
                        <Box sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: '#4caf50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}>
                            <Send sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="h6" color="success.main" gutterBottom>
                            Story Shared Successfully!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your farming story has been shared with the community.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3,marginTop: 2 }}>
                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        {/* Title Field */}
                        <TextField
                            fullWidth
                            label="Story Title"
                            placeholder="Give your story an engaging title..."
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            variant="outlined"
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2e7d32',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#2e7d32',
                                },
                            }}
                        />

                        {/* Description Field */}
                        <TextField
                            fullWidth
                            label="Description"
                            placeholder="Share your farming experience, tips, or insights..."
                            value={formData.description}
                            onChange={handleInputChange('description')}
                            multiline
                            rows={4}
                            variant="outlined"
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2e7d32',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#2e7d32',
                                },
                            }}
                        />

                        {/* Image Upload Section */}
                        <FormControl fullWidth>
                            <InputLabel shrink sx={{
                                position: 'relative',
                                transform: 'none',
                                fontSize: '1rem',
                                color: '#2e7d32',
                                fontWeight: 'medium',
                                mb: 1
                            }}>
                                Add Photo
                            </InputLabel>

                            {imagePreview ? (
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        position: 'relative',
                                        borderRadius: 2,
                                        border: '2px dashed #c8e6c9'
                                    }}
                                >
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 200,
                                        borderRadius: 1,
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <Button
                                            onClick={removeImage}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                minWidth: 'auto',
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0,0,0,0.8)'
                                                }
                                            }}
                                        >
                                            <Close fontSize="small" />
                                        </Button>
                                    </Box>
                                </Paper>
                            ) : (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        border: '2px dashed #c8e6c9',
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: 'center',
                                        backgroundColor: '#f1f8e9',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#4caf50',
                                            backgroundColor: '#e8f5e8'
                                        }
                                    }}
                                    component="label"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        disabled={loading}
                                    />
                                    <ImageIcon sx={{
                                        fontSize: 48,
                                        color: '#4caf50',
                                        mb: 1
                                    }} />
                                    <Typography variant="body1" sx={{
                                        color: '#2e7d32',
                                        fontWeight: 'medium',
                                        mb: 0.5
                                    }}>
                                        Click to upload an image
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Supports JPG, PNG, GIF (Max 5MB)
                                    </Typography>
                                </Paper>
                            )}
                        </FormControl>
                    </Box>
                )}
            </DialogContent>

            {/* Actions */}
            {!success && (
                <DialogActions sx={{
                    p: 3,
                    backgroundColor: '#fafafa',
                    gap: 1
                }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        disabled={loading}
                        sx={{
                            borderColor: '#c8e6c9',
                            color: '#2e7d32',
                            '&:hover': {
                                borderColor: '#4caf50',
                                backgroundColor: '#f1f8e9'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        sx={{
                            backgroundColor: '#2e7d32',
                            '&:hover': {
                                backgroundColor: '#1b5e20'
                            },
                            '&:disabled': {
                                backgroundColor: '#c8e6c9'
                            }
                        }}
                    >
                        {loading ? 'Sharing...' : 'Share Story'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default ShareStoryForm;