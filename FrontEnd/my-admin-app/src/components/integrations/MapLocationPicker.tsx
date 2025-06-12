import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Alert,
    Chip,
    InputAdornment,
    TextField,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Close as CloseIcon,
    MyLocation as MyLocationIcon,
    Search as SearchIcon,
    PinDrop as PinDropIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
    address: string;
    city: string;
    latitude?: number;
    longitude?: number;
}

interface MapLocationPickerProps {
    open: boolean;
    onClose: () => void;
    onLocationSelect: (location: LocationData) => void;
    initialLocation?: LocationData;
}

// Custom red marker icon for selected location
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map click events
function LocationMarker({ position, setPosition, onLocationChange }: {
    position: [number, number] | null;
    setPosition: (pos: [number, number] | null) => void;
    onLocationChange: (location: LocationData) => void;
}) {
    const map = useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            map.flyTo(e.latlng, map.getZoom());
            
            // Reverse geocoding
            try {
                const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    onLocationChange({
                        address: data.locality || data.city || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                        city: data.city || data.locality || '',
                        latitude: lat,
                        longitude: lng
                    });
                }
            } catch (error) {
                console.error('Reverse geocoding failed:', error);
                onLocationChange({
                    address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                    city: '',
                    latitude: lat,
                    longitude: lng
                });
            }
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={redIcon}>
            <Popup>
                <Box sx={{ textAlign: 'center', minWidth: 200 }}>
                    <PinDropIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                        Selected Location
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Lat: {position[0].toFixed(6)}<br />
                        Lng: {position[1].toFixed(6)}
                    </Typography>
                </Box>
            </Popup>
        </Marker>
    );
}

export default function MapLocationPicker({ 
    open, 
    onClose, 
    onLocationSelect, 
    initialLocation 
}: MapLocationPickerProps) {
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationData>({ address: '', city: '' });
    const [mapCenter, setMapCenter] = useState<[number, number]>([7.8731, 80.7718]); // Sri Lanka center
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const mapRef = useRef<any>(null);
    
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Initialize with existing location if available
    useEffect(() => {
        if (initialLocation?.latitude && initialLocation?.longitude) {
            const pos: [number, number] = [initialLocation.latitude, initialLocation.longitude];
            setSelectedPosition(pos);
            setMapCenter(pos);
            setSelectedLocation(initialLocation);
        }
    }, [initialLocation]);

    // Get current location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const pos: [number, number] = [latitude, longitude];
                setSelectedPosition(pos);
                setMapCenter(pos);
                
                // Trigger reverse geocoding
                handleLocationChange({
                    address: 'Current Location',
                    city: '',
                    latitude,
                    longitude
                });

                // Fly to current location
                if (mapRef.current) {
                    mapRef.current.flyTo(pos, 15);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setError('Unable to get your current location.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    // Search for location
    const searchLocation = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        setError('');
        
        try {
            // Using Nominatim for geocoding (free OpenStreetMap service)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Sri Lanka')}&limit=1`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lng = parseFloat(result.lon);
                    const pos: [number, number] = [lat, lng];
                    
                    setSelectedPosition(pos);
                    setMapCenter(pos);
                    
                    handleLocationChange({
                        address: result.display_name,
                        city: result.display_name.split(',')[1]?.trim() || '',
                        latitude: lat,
                        longitude: lng
                    });

                    // Fly to searched location
                    if (mapRef.current) {
                        mapRef.current.flyTo(pos, 15);
                    }
                } else {
                    setError('Location not found. Please try a different search term.');
                }
            }
        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocationChange = (location: LocationData) => {
        setSelectedLocation(location);
        setError('');
    };

    const handleConfirm = () => {
        if (selectedLocation.address) {
            onLocationSelect(selectedLocation);
        } else {
            setError('Please select a location on the map.');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            searchLocation();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 3,
                    height: fullScreen ? '100vh' : '80vh',
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
                    py: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PinDropIcon sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold">
                        Select Location on Map
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ 
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Search and Controls */}
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="Search for a location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            size="small"
                        />
                        <Button
                            variant="outlined"
                            onClick={searchLocation}
                            disabled={isSearching || !searchQuery.trim()}
                            sx={{ minWidth: 100, textTransform: 'none' }}
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={getCurrentLocation}
                            startIcon={<MyLocationIcon />}
                            sx={{ minWidth: 150, textTransform: 'none' }}
                        >
                            Current Location
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {selectedLocation.address && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<PinDropIcon />}
                                label={selectedLocation.address}
                                color="primary"
                                variant="outlined"
                            />
                            {selectedLocation.city && (
                                <Chip
                                    label={selectedLocation.city}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    )}
                </Box>

                {/* Map */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            position={selectedPosition}
                            setPosition={setSelectedPosition}
                            onLocationChange={handleLocationChange}
                        />
                    </MapContainer>
                    
                    {/* Instructions overlay */}
                    <Box sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        right: 16,
                        zIndex: 1000,
                        pointerEvents: 'none'
                    }}>
                        <Alert severity="info" sx={{ pointerEvents: 'auto' }}>
                            <Typography variant="body2">
                                🗺️ Click anywhere on the map to pin your location
                            </Typography>
                        </Alert>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'space-between' }}>
                <Box>
                    {selectedPosition && (
                        <Typography variant="caption" color="text.secondary">
                            📍 {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{ minWidth: 100, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        disabled={!selectedLocation.address}
                        startIcon={<CheckIcon />}
                        sx={{ minWidth: 120, textTransform: 'none' }}
                    >
                        Confirm Location
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
