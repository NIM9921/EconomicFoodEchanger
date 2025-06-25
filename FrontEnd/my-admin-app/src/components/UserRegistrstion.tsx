// UserRegistration.tsx with community member checkbox functionality
import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Avatar,
    Alert,
    Card,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormHelperText,
    Divider,
    useTheme,
    useMediaQuery,
    FormControlLabel,
    Checkbox,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';
import ApiConfig from '../utils/ApiConfig';

const PageWrapper = styled('div')({
    height: '100vh',
    overflowY: 'auto'
});

const RegisterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(6),
    backgroundImage: 'linear-gradient(rgba(240, 247, 235, 0.8), rgba(220, 237, 215, 0.9))',
    backgroundSize: 'cover',
    position: 'relative',
    minHeight: '100%'
}));

const LeafBackground = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    zIndex: 0,
    pointerEvents: 'none',
    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 80 80\'%3E%3Cpath fill=\'%23558b2f\' d=\'M0,0 L80,80 L0,80 Z\'/%3E%3C/svg%3E") repeat'
});

export default function UserRegistration() {
    // Basic user fields
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [nic, setNic] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    // Community member checkbox and fields
    const [isCommunityMember, setIsCommunityMember] = useState(false);
    const [communityFirstName, setCommunityFirstName] = useState('');
    const [communityLastName, setCommunityLastName] = useState('');
    const [communityEmail, setCommunityEmail] = useState('');
    const [communityCity, setCommunityCity] = useState('');
    const [communityAddress, setCommunityAddress] = useState('');
    const [shopOrFarmName, setShopOrFarmName] = useState('');
    const [communityNic, setCommunityNic] = useState('');
    const [communityMobileNumber, setCommunityMobileNumber] = useState('');
    const [description, setDescription] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const availableRoles = [
        { id: 1, name: 'buyer' },
        { id: 2, name: 'seller' },
        { id: 3, name: 'farmer' },
        { id: 4, name: 'admin' }
    ];

    const handleRoleChange = (event: any) => {
        const value = event.target.value;
        setSelectedRoles(typeof value === 'string' ? value.split(',') : value);
    };

    const validateForm = () => {
        setError('');

        // Basic validation
        if (!name || !city || !address || !nic || !mobileNumber || !username || !password || !confirmPassword) {
            setError('Please fill in all required basic fields');
            return false;
        }

        if (selectedRoles.length === 0) {
            setError('Please select at least one role');
            return false;
        }

        if (password.length < 4) {
            setError('Password must be at least 4 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        // Phone validation
        const phoneRegex = /^\d{9,10}$/;
        if (!phoneRegex.test(mobileNumber)) {
            setError('Please enter a valid mobile number (9-10 digits)');
            return false;
        }

        // Community member validation if checkbox is checked
        if (isCommunityMember) {
            if (!communityFirstName || !communityLastName || !communityEmail || 
                !communityCity || !communityAddress || !communityNic || !communityMobileNumber) {
                setError('Please fill in all required community member fields');
                return false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(communityEmail)) {
                setError('Please enter a valid email address for community member');
                return false;
            }

            if (!phoneRegex.test(communityMobileNumber)) {
                setError('Please enter a valid mobile number for community member');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data in the format matching your JSON structure
            const userData = {
                name,
                city,
                address,
                status: false, // Default status
                nic,
                mobileNumber: parseInt(mobileNumber),
                username,
                password,
                roleList: selectedRoles.map(roleName => {
                    const role = availableRoles.find(r => r.name === roleName);
                    return { id: role?.id || 0, name: roleName };
                }),
                // Only include communityMember if checkbox is checked
                ...(isCommunityMember && {
                    communityMember: {
                        firstName: communityFirstName,
                        lastName: communityLastName,
                        email: communityEmail,
                        city: communityCity,
                        address: communityAddress,
                        shopOrFarmName,
                        nic: communityNic,
                        mobileNumber: communityMobileNumber,
                        description
                    }
                })
            };

            // Make actual API call to your server
            const response = await fetch(ApiConfig.Domain+'/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Registration successful:', data);

            setSuccess('Registration successful! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(`Registration failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            console.error('Registration error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#2e7d32',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#2e7d32',
        },
    };

    return (
        <PageWrapper>
            <LeafBackground />
            <RegisterContainer>
                <Card sx={{
                    width: '100%',
                    maxWidth: { xs: '95%', sm: '550px' },
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.25)',
                    position: 'relative',
                    zIndex: 1,
                    border: '1px solid #c8e6c9',
                    mb: 5,
                    mt: 2
                }}>
                    <Box sx={{
                        height: '8px',
                        backgroundColor: '#2e7d32',
                        width: '100%'
                    }} />

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: { xs: 2, sm: 3, md: 4 },
                        backgroundColor: 'white',
                    }}>
                        <Avatar sx={{
                            width: { xs: 60, sm: 70 },
                            height: { xs: 60, sm: 70 },
                            bgcolor: '#558b2f',
                            boxShadow: '0 4px 8px rgba(85, 139, 47, 0.3)',
                            mb: 2,
                        }}>
                            <LocalFloristIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
                        </Avatar>

                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                            Create Account
                        </Typography>

                        <Typography variant="body1" sx={{ color: '#558b2f', mb: 3, textAlign: 'center' }}>
                            Join our agricultural community today
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                                {success}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Basic Information
                            </Typography>

                            <TextField
                                fullWidth
                                required
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: '#558b2f' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ ...inputStyle, mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                required
                                label="City"
                                variant="outlined"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationCityIcon sx={{ color: '#558b2f' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ ...inputStyle, mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                required
                                label="Address"
                                variant="outlined"
                                multiline
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HomeIcon sx={{ color: '#558b2f', mt: 1.5 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    ...inputStyle,
                                    mb: 2,
                                    '& .MuiInputBase-root': {
                                        alignItems: 'flex-start'
                                    }
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="NIC"
                                    variant="outlined"
                                    value={nic}
                                    onChange={(e) => setNic(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon sx={{ color: '#558b2f' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputStyle}
                                />

                                <TextField
                                    fullWidth
                                    required
                                    label="Mobile Number"
                                    variant="outlined"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon sx={{ color: '#558b2f' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputStyle}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Account Details
                            </Typography>

                            <TextField
                                fullWidth
                                required
                                label="Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: '#558b2f' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ ...inputStyle, mb: 2 }}
                            />

                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: '#558b2f' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputStyle}
                                />

                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    label="Confirm Password"
                                    variant="outlined"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: '#558b2f' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputStyle}
                                />
                            </Box>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="roles-label" sx={{
                                    '&.Mui-focused': { color: '#2e7d32' }
                                }}>
                                    Select Roles *
                                </InputLabel>
                                <Select
                                    labelId="roles-label"
                                    multiple
                                    value={selectedRoles}
                                    onChange={handleRoleChange}
                                    label="Select Roles *"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#c8e6c9',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#81c784',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#2e7d32',
                                        }
                                    }}
                                >
                                    {availableRoles.map((role) => (
                                        <MenuItem key={role.id} value={role.name}>
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select one or more roles</FormHelperText>
                            </FormControl>

                            <Divider sx={{ my: 2 }} />

                            {/* Community Member Section */}
                            <Box sx={{ mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isCommunityMember}
                                            onChange={(e) => setIsCommunityMember(e.target.checked)}
                                            sx={{
                                                color: '#558b2f',
                                                '&.Mui-checked': {
                                                    color: '#2e7d32',
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <GroupIcon sx={{ color: '#558b2f' }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                I am a Community Member
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>

                            {/* Community Member Fields - Only show when checkbox is checked */}
                            {isCommunityMember && (
                                <Box sx={{ 
                                    border: '2px solid #c8e6c9', 
                                    borderRadius: 2, 
                                    p: 2, 
                                    mb: 2,
                                    backgroundColor: '#f1f8e9'
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#2e7d32' }}>
                                        Community Member Information
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <TextField
                                            fullWidth
                                            required={isCommunityMember}
                                            label="First Name"
                                            variant="outlined"
                                            value={communityFirstName}
                                            onChange={(e) => setCommunityFirstName(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: '#558b2f' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={inputStyle}
                                        />

                                        <TextField
                                            fullWidth
                                            required={isCommunityMember}
                                            label="Last Name"
                                            variant="outlined"
                                            value={communityLastName}
                                            onChange={(e) => setCommunityLastName(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: '#558b2f' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={inputStyle}
                                        />
                                    </Box>

                                    <TextField
                                        fullWidth
                                        required={isCommunityMember}
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        value={communityEmail}
                                        onChange={(e) => setCommunityEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon sx={{ color: '#558b2f' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ ...inputStyle, mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        required={isCommunityMember}
                                        label="City"
                                        variant="outlined"
                                        value={communityCity}
                                        onChange={(e) => setCommunityCity(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationCityIcon sx={{ color: '#558b2f' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ ...inputStyle, mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        required={isCommunityMember}
                                        label="Address"
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        value={communityAddress}
                                        onChange={(e) => setCommunityAddress(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <HomeIcon sx={{ color: '#558b2f', mt: 1.5 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            ...inputStyle,
                                            mb: 2,
                                            '& .MuiInputBase-root': {
                                                alignItems: 'flex-start'
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Shop/Farm Name"
                                        variant="outlined"
                                        value={shopOrFarmName}
                                        onChange={(e) => setShopOrFarmName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <StoreIcon sx={{ color: '#558b2f' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ ...inputStyle, mb: 2 }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <TextField
                                            fullWidth
                                            required={isCommunityMember}
                                            label="NIC"
                                            variant="outlined"
                                            value={communityNic}
                                            onChange={(e) => setCommunityNic(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BadgeIcon sx={{ color: '#558b2f' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={inputStyle}
                                        />

                                        <TextField
                                            fullWidth
                                            required={isCommunityMember}
                                            label="Mobile Number"
                                            variant="outlined"
                                            value={communityMobileNumber}
                                            onChange={(e) => setCommunityMobileNumber(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon sx={{ color: '#558b2f' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={inputStyle}
                                        />
                                    </Box>

                                    <TextField
                                        fullWidth
                                        label="Description"
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DescriptionIcon sx={{ color: '#558b2f', mt: 1.5 }} />
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
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: { xs: 1.2, sm: 1.5 },
                                    bgcolor: '#2e7d32',
                                    '&:hover': {
                                        bgcolor: '#1b5e20',
                                    },
                                }}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Register'}
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate('/login')}
                                sx={{
                                    color: '#558b2f',
                                    borderColor: '#558b2f',
                                    '&:hover': {
                                        borderColor: '#2e7d32',
                                        bgcolor: 'rgba(85, 139, 47, 0.04)'
                                    }
                                }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </RegisterContainer>
        </PageWrapper>
    );
}