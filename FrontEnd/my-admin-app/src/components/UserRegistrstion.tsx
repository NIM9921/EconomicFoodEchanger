// UserRegistration.tsx with TypeScript fixes and scrolling fixes
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
import { useNavigate } from 'react-router-dom';

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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userRole, setUserRole] = useState('farmer');
    // Fields
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [shopOrFarmName, setShopOrFarmName] = useState('');
    const [nic, setNic] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [description, setDescription] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const validateForm = () => {
        setError('');

        if (!firstName || !lastName || !email || !password || !confirmPassword ||
            !city || !address || !mobileNumber || !nic) {
            setError('Please fill in all required fields');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(mobileNumber)) {
            setError('Please enter a valid 10-digit mobile number');
            return false;
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store user in localStorage (in production, you'd use a backend API)
            localStorage.setItem(`user_${email}`, JSON.stringify({
                firstName,
                lastName,
                email,
                userRole,
                city,
                address,
                shopOrFarmName,
                nic,
                mobileNumber,
                description
            }));

            setSuccess('Registration successful! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (_err) {
            setError('Registration failed. Please try again.');
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Personal Information
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="First Name"
                                    variant="outlined"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
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
                                    required
                                    label="Last Name"
                                    variant="outlined"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
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
                                required
                                label="Email"
                                variant="outlined"
                                type="email"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: '#558b2f' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyle}
                            />

                            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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

                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Location Details
                            </Typography>

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
                                sx={{
                                    ...inputStyle,
                                    mb: 2
                                }}
                            />

                            {/* Enhanced Address field with more space */}
                            <TextField
                                fullWidth
                                required
                                label="Address"
                                variant="outlined"
                                multiline
                                rows={4}
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

                            <TextField
                                fullWidth
                                label="Shop/Farm Name"
                                variant="outlined"
                                margin="normal"
                                value={shopOrFarmName}
                                onChange={(e) => setShopOrFarmName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <StoreIcon sx={{ color: '#558b2f' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyle}
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                margin="normal"
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

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Account Security
                            </Typography>

                            <TextField
                                fullWidth
                                required
                                type="password"
                                label="Password"
                                variant="outlined"
                                margin="normal"
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
                                margin="normal"
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

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="user-role-label" sx={{
                                    '&.Mui-focused': { color: '#2e7d32' }
                                }}>
                                    I am a
                                </InputLabel>
                                <Select
                                    labelId="user-role-label"
                                    value={userRole}
                                    label="I am a"
                                    onChange={(e) => setUserRole(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#c8e6c9',
                                            '&:hover': {
                                                borderColor: '#81c784',
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="farmer">Farmer</MenuItem>
                                    <MenuItem value="buyer">Buyer</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                                <FormHelperText>Select your primary role in the system</FormHelperText>
                            </FormControl>

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