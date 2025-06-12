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
    IconButton,
    Alert,
    Paper,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Grid,
    Card,
    CardMedia,
    useTheme,
    useMediaQuery,
    InputAdornment,
    Autocomplete,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Close as CloseIcon,
    CloudUpload as CloudUploadIcon,
    Image as ImageIcon,
    Delete as DeleteIcon,
    PostAdd as PostAddIcon,
    Title as TitleIcon,
    Description as DescriptionIcon,
    Category as CategoryIcon,
    Person as PersonIcon,
    Numbers as NumbersIcon,
    LocationOn as LocationOnIcon,
    MyLocation as MyLocationIcon,
    Map as MapIcon,
    PinDrop as PinDropIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ApiConfig from '../../utils/ApiConfig';
import MapLocationPicker from './MapLocationPicker';

interface SharePostProps {
    open: boolean;
    onClose: () => void;
}

interface CategoryStatus {
    id: number;
    status: string;
}

interface LocationData {
    address: string;
    city: string;
    latitude?: number;
    longitude?: number;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const UploadArea = styled(Paper)(({ theme }) => ({
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(6),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        borderColor: theme.palette.primary.dark,
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));

const PhotoCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

// Sri Lankan cities for location selection
const sriLankanCities = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura', 'Polonnaruwa',
    'Trincomalee', 'Batticaloa', 'Kurunegala', 'Ratnapura', 'Badulla', 'Matara',
    'Vavuniya', 'Chilaw', 'Kalutara', 'Panadura', 'Gampaha', 'Kegalle', 'Nuwara Eliya',
    'Hambantota', 'Monaragala', 'Puttalam', 'Ampara', 'Mannar', 'Kilinochchi',
    'Mullaittivu', 'Matale', 'Bandarawela', 'Hatton', 'Dambulla', 'Sigiriya',
    'Bentota', 'Hikkaduwa', 'Mirissa', 'Unawatuna', 'Ella', 'Tissamaharama',
    'Kataragama', 'Avissawella', 'Horana', 'Wattala', 'Ja-Ela', 'Ragama',
    'Kelaniya', 'Maharagama', 'Moratuwa', 'Mount Lavinia', 'Dehiwala',
    'Kotte', 'Malabe', 'Kaduwela', 'Hanwella', 'Piliyandala'
];

export default function SharePostForm({ open, onClose }: SharePostProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [userId, setUserId] = useState<number>(1);
    const [categoryStatus, setCategoryStatus] = useState<CategoryStatus | null>(null);
    const [location, setLocation] = useState<LocationData>({ address: '', city: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationTab, setLocationTab] = useState(0); // 0 for manual, 1 for map
    const [mapOpen, setMapOpen] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Only 2 category statuses
    const categoryStatuses: CategoryStatus[] = [
        { id: 1, status: "Selling post" },
        { id: 2, status: "Buying post" }
    ];

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'primary.main',
        },
    };

    // Get current location using browser geolocation API
    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    // Reverse geocoding to get address (using a free service)
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        setLocation({
                            address: data.locality || data.city || 'Current Location',
                            city: data.city || data.locality || '',
                            latitude,
                            longitude
                        });
                    } else {
                        setLocation({
                            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                            city: '',
                            latitude,
                            longitude
                        });
                    }
                } catch (err) {
                    console.error('Reverse geocoding failed:', err);
                    setLocation({
                        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                        city: '',
                        latitude,
                        longitude
                    });
                }
                
                setIsGettingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setError('Unable to get your location. Please enter manually.');
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        // Validate file types - only images
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            setError('Please select only image files (JPEG, PNG, GIF, WebP).');
            return;
        }

        // Validate file sizes (5MB limit for images)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError('Image size should not exceed 5MB.');
            return;
        }

        // Limit total files to 10
        if (selectedFiles.length + files.length > 10) {
            setError('You can upload maximum 10 images.');
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);
        setError('');

        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Clear the input
        event.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        const selectedId = parseInt(event.target.value);
        const selected = categoryStatuses.find(cat => cat.id === selectedId);
        setCategoryStatus(selected || null);
    };

    const validateForm = (): boolean => {
        setError('');

        if (!title.trim()) {
            setError('Title is required.');
            return false;
        }

        if (!description.trim()) {
            setError('Description is required.');
            return false;
        }

        if (quantity <= 0) {
            setError('Quantity must be greater than 0.');
            return false;
        }

        if (!location.address.trim()) {
            setError('Location address is required.');
            return false;
        }

        if (selectedFiles.length === 0) {
            setError('Please select at least one image.');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            
            // Add text fields as regular form parameters
            formData.append('title', title);
            formData.append('description', description);
            formData.append('quantity', quantity.toString());
            formData.append('userId', userId.toString());
            
            // Add location data
            formData.append('address', location.address);
            formData.append('city', location.city);
            if (location.latitude !== undefined) {
                formData.append('latitude', location.latitude.toString());
            }
            if (location.longitude !== undefined) {
                formData.append('longitude', location.longitude.toString());
            }

            // Add files
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            // Add category status as JSON blob if selected
            if (categoryStatus) {
                const categoryBlob = new Blob(
                    [JSON.stringify(categoryStatus)], 
                    { type: 'application/json' }
                );
                formData.append('categoreystatus_id', categoryBlob);
            }

            console.log('Submitting form data:', {
                title,
                description,
                quantity,
                userId,
                location,
                categoryStatus,
                filesCount: selectedFiles.length
            });

            const response = await fetch(ApiConfig.Domain + '/sharedpost/upload-media', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.text();
            console.log('Upload result:', result);

            setSuccess('Post uploaded successfully!');
            
            // Reset form after successful submission
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err) {
            console.error('Upload failed:', err);
            setError(`Failed to upload post: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset all form fields
        setTitle('');
        setDescription('');
        setQuantity(1);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setCategoryStatus(null);
        setLocation({ address: '', city: '' });
        setError('');
        setSuccess('');
        setIsSubmitting(false);
        onClose();
    };

    // Handle location selection from map
    const handleLocationFromMap = (locationData: LocationData) => {
        setLocation(locationData);
        setMapOpen(false);
    };

    const handleLocationTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setLocationTab(newValue);
        if (newValue === 1) {
            setMapOpen(true);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={!isSubmitting ? handleClose : undefined}
            maxWidth="lg" // Changed to lg for better map display
            fullWidth
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 3,
                    minHeight: fullScreen ? '100vh' : 'auto',
                    maxHeight: '95vh',
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 2.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PostAddIcon sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold">
                        Share New Post
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    sx={{ 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                    disabled={isSubmitting}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" sx={{ width: '100%' }}>
                    {/* Post Information Section */}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                        Post Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Post Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter an engaging title for your post..."
                                required
                                disabled={isSubmitting}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TitleIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyle}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your post in detail... What makes it special?"
                                required
                                disabled={isSubmitting}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon sx={{ color: 'primary.main', mt: 1.5 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    ...inputStyle,
                                    '& .MuiInputBase-root': {
                                        alignItems: 'flex-start'
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                variant="outlined"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                required
                                disabled={isSubmitting}
                                InputProps={{
                                    inputProps: { min: 1 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <NumbersIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyle}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="User ID"
                                variant="outlined"
                                type="number"
                                value={userId}
                                onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
                                disabled={isSubmitting}
                                InputProps={{
                                    inputProps: { min: 1 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyle}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ '&.Mui-focused': { color: 'primary.main' } }}>
                                    Post Type (Optional)
                                </InputLabel>
                                <Select
                                    value={categoryStatus?.id.toString() || ''}
                                    label="Post Type (Optional)"
                                    onChange={handleCategoryChange}
                                    disabled={isSubmitting}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CategoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                                        </InputAdornment>
                                    }
                                    sx={{
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        }
                                    }}
                                >
                                    {categoryStatuses.map((category) => (
                                        <MenuItem key={category.id} value={category.id.toString()}>
                                            {category.status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Location Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2, mb: 2 }}>
                                Location Information
                            </Typography>
                            
                            {/* Location Selection Tabs */}
                            <Tabs
                                value={locationTab}
                                onChange={handleLocationTabChange}
                                sx={{ 
                                    mb: 3,
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 'medium'
                                    }
                                }}
                            >
                                <Tab 
                                    icon={<LocationOnIcon />} 
                                    label="Manual Entry" 
                                    iconPosition="start"
                                    disabled={isSubmitting}
                                />
                                <Tab 
                                    icon={<MapIcon />} 
                                    label="Pick from Map" 
                                    iconPosition="start"
                                    disabled={isSubmitting}
                                />
                            </Tabs>
                        </Grid>

                        {/* Manual Location Entry */}
                        {locationTab === 0 && (
                            <>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        label="Address / Location Description"
                                        variant="outlined"
                                        value={location.address}
                                        onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="Enter specific address or location description..."
                                        required
                                        disabled={isSubmitting}
                                        multiline
                                        rows={2}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationOnIcon sx={{ color: 'primary.main', mt: 1 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={inputStyle}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                                        <Autocomplete
                                            options={sriLankanCities}
                                            value={location.city}
                                            onChange={(event, newValue) => {
                                                setLocation(prev => ({ ...prev, city: newValue || '' }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="City"
                                                    variant="outlined"
                                                    disabled={isSubmitting}
                                                    sx={inputStyle}
                                                    placeholder="Select or type city..."
                                                />
                                            )}
                                            freeSolo
                                            disabled={isSubmitting}
                                        />
                                        
                                        <Button
                                            variant="outlined"
                                            onClick={getCurrentLocation}
                                            disabled={isSubmitting || isGettingLocation}
                                            startIcon={<MyLocationIcon />}
                                            sx={{ 
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                py: 1
                                            }}
                                        >
                                            {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </>
                        )}

                        {/* Map Location Display */}
                        {locationTab === 1 && (
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    p: 3, 
                                    border: '1px dashed',
                                    borderColor: 'primary.main',
                                    borderRadius: 2,
                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                    textAlign: 'center'
                                }}>
                                    <PinDropIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Select Location on Map
                                    </Typography>
                                    
                                    {location.address ? (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body1" fontWeight="medium" gutterBottom>
                                                Selected Location:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                📍 {location.address}
                                            </Typography>
                                            {location.city && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    🏙️ {location.city}
                                                </Typography>
                                            )}
                                            {location.latitude && location.longitude && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                                </Typography>
                                            )}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Click the button below to open the map and pin your location
                                        </Typography>
                                    )}
                                    
                                    <Button
                                        variant="contained"
                                        onClick={() => setMapOpen(true)}
                                        disabled={isSubmitting}
                                        startIcon={<MapIcon />}
                                        sx={{ 
                                            mt: 2,
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            px: 4
                                        }}
                                    >
                                        {location.address ? 'Change Location' : 'Open Map'}
                                    </Button>
                                </Box>
                            </Grid>
                        )}

                        {/* Show coordinates if available */}
                        {location.latitude && location.longitude && locationTab === 0 && (
                            <Grid item xs={12}>
                                <Alert severity="info" sx={{ mt: 1 }}>
                                    <Typography variant="body2">
                                        📍 Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </Typography>
                                </Alert>
                            </Grid>
                        )}
                    </Grid>

                    {/* Photo Upload Section */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                            Upload Photos
                        </Typography>

                        <UploadArea component="label" elevation={0}>
                            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" color="primary" gutterBottom>
                                Click to upload photos
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                                Drag and drop your images here or click to browse
                            </Typography>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Supported formats: JPEG, PNG, GIF, WebP<br />
                                Maximum size: 5MB per image | Maximum: 10 images
                            </Typography>
                            <Button
                                component="span"
                                variant="contained"
                                startIcon={<ImageIcon />}
                                disabled={isSubmitting}
                                sx={{ mt: 3, borderRadius: 2, px: 4 }}
                            >
                                Choose Photos
                            </Button>
                            <VisuallyHiddenInput
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={isSubmitting}
                            />
                        </UploadArea>

                        {/* Photo Preview Grid */}
                        {selectedFiles.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Selected Photos ({selectedFiles.length}/10)
                                    </Typography>
                                    <Chip 
                                        label={`${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                                
                                <Grid container spacing={3}>
                                    {selectedFiles.map((file, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <PhotoCard>
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={previewUrls[index]}
                                                    alt={file.name}
                                                    sx={{ objectFit: 'cover' }}
                                                />
                                                
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveFile(index)}
                                                    disabled={isSubmitting}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(4px)',
                                                        '&:hover': { 
                                                            bgcolor: 'rgba(255, 255, 255, 1)',
                                                            color: 'error.main'
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                                
                                                <Box sx={{ 
                                                    p: 2, 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    bgcolor: 'background.paper'
                                                }}>
                                                    <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1, mr: 1 }}>
                                                        {file.name}
                                                    </Typography>
                                                    <Chip
                                                        label={`${(file.size / 1024 / 1024).toFixed(1)} MB`}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </PhotoCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 2, gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={isSubmitting}
                    sx={{ 
                        minWidth: 120,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting || selectedFiles.length === 0}
                    sx={{ 
                        minWidth: 120,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4
                        }
                    }}
                >
                    {isSubmitting ? 'Uploading...' : 'Share Post'}
                </Button>
            </DialogActions>

            {/* Map Location Picker Modal */}
            <MapLocationPicker
                open={mapOpen}
                onClose={() => setMapOpen(false)}
                onLocationSelect={handleLocationFromMap}
                initialLocation={location}
            />
        </Dialog>
    );
}