// Login.tsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Avatar,
    Divider,
    Alert,
    Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import SpaIcon from '@mui/icons-material/Spa';
import { useNavigate } from 'react-router-dom';
import GrassIcon from '@mui/icons-material/Grass';
// Custom styled components
const LoginContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: theme.spacing(3),
    backgroundImage: 'linear-gradient(rgba(240, 247, 235, 0.8), rgba(220, 237, 215, 0.9))',
    backgroundSize: 'cover',
    position: 'relative',
    overflow: 'hidden'
}));

const LeafBackground = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    zIndex: 0,
    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 80 80\'%3E%3Cpath fill=\'%23558b2f\' d=\'M0,0 L80,80 L0,80 Z\'/%3E%3C/svg%3E") repeat'
});

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password');
            setIsSubmitting(false);
            return;
        }

        try {
            // Mock login - replace with actual authentication logic
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Agricultural-themed example users
            if (email === 'akila@gmail.com' && password === '123') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'farmer');
                localStorage.setItem('FirstName', 'Akila');
                localStorage.setItem('LastName', 'Weerasinghe');
                onLogin();
                navigate('/dashboard');
            } else if (email === 'nimni@gmail.com' && password === '1234') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('FirstName', 'Nimni');
                localStorage.setItem('LastName', 'Reshani');
                onLogin();
                navigate('/admin-dashboard');
            }else {
                setError('Invalid credentials. Try using farmer@example.com / harvest123');
            }
        } catch (_err) { // Changed from err to _err to indicate it's intentionally unused
            setError('Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LoginContainer>
            <LeafBackground />
            <Card sx={{
                width: '100%',
                maxWidth: 450,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.25)',
                position: 'relative',
                zIndex: 1,
                border: '1px solid #c8e6c9',
                overflow: 'visible',
                transform: 'translateY(0)',
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(46, 125, 50, 0.35)',
                }
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
                    p: 4,
                    backgroundColor: 'white',
                }}>
                    <Avatar sx={{
                        width: 70,
                        height: 70,
                        bgcolor: '#558b2f',
                        boxShadow: '0 4px 8px rgba(85, 139, 47, 0.3)',
                        mb: 2,
                        animation: 'grow 2s infinite alternate',
                        '@keyframes grow': {
                            '0%': { transform: 'scale(1)' },
                            '100%': { transform: 'scale(1.05)' }
                        }
                    }}>
                        <LocalFloristIcon sx={{ fontSize: 40 }} />
                    </Avatar>

                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                        Economic Food Exchanger
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#558b2f', mb: 3, textAlign: 'center' }}>
                        Log in to access your agricultural dashboard
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: '#558b2f' }} />
                                    </InputAdornment>
                                ),
                            }}
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

                        <TextField
                            fullWidth
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                bgcolor: '#2e7d32',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 3px 5px rgba(46, 125, 50, 0.3)',
                                '&:hover': {
                                    bgcolor: '#1b5e20',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 10px rgba(46, 125, 50, 0.4)'
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                    boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)'
                                }
                            }}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login to Greculture'}
                        </Button>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="caption" color="text.secondary">OR</Typography>
                        </Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<SpaIcon />}
                            sx={{
                                color: '#558b2f',
                                borderColor: '#558b2f',
                                '&:hover': {
                                    borderColor: '#2e7d32',
                                    bgcolor: 'rgba(85, 139, 47, 0.04)'
                                }
                            }}
                        >
                            Continue as Guest Farmer
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button
                            size="small"
                            sx={{ color: '#558b2f' }}
                            startIcon={<GrassIcon sx={{ fontSize: 14 }} />}
                        >
                            Forgot Password
                        </Button>
                        <Button
                            size="small"
                            sx={{ color: '#558b2f' }}
                            startIcon={<GrassIcon sx={{ fontSize: 14 }} />}
                            onClick={() => navigate('/register')}
                        >
                            Create Account
                        </Button>
                    </Box>
                </Box>
            </Card>
        </LoginContainer>
    );
}