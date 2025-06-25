import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import SidebarMenu from './SidebarMenu';
import DealersDetails from './DealersDetails.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Reports from './Reports';
import Integrations from './Integrations';
import Settings from './Settings';
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import UserRegistration from './UserRegistrstion.tsx';
import UserProfile from './UserProfile.tsx';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    backgroundColor: '#ffffff', /* Add this line */
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
    },
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        marginLeft: `calc(${theme.spacing(8)} + 1px)`,
    },
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}px`,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

export default function AppLayout() {
    const [open, setOpen] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(
        localStorage.getItem('isLoggedIn') === 'true'
    );

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('FirstName');
        localStorage.removeItem('LastName');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
                <CssBaseline />
                {isAuthenticated && (
                    <>
                        <PrimarySearchAppBar onMenuClick={toggleDrawer} onLogout={handleLogout} />
                        <SidebarMenu open={open} />
                    </>
                )}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {isAuthenticated ? (
                        <Main open={open}>
                            <DrawerHeader />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/users" element={<DealersDetails />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/integrations" element={<Integrations />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/userprofile" element={<UserProfile />} />
                                <Route path="/login" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Main>
                    ) : (
                        <Routes>
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/register" element={<UserRegistration />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    )}
                </Box>
            </Box>
        </Router>
    );
}