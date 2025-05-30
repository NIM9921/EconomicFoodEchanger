import * as React from 'react';
import {
    Box,
    Grid,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Avatar,
    Pagination,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PendingIcon from '@mui/icons-material/Pending';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BusinessIcon from '@mui/icons-material/Business';
import RecommendIcon from '@mui/icons-material/Recommend';

interface User {
    id: number;
    email: string;
    username: string;
    name: {
        firstname: string;
        lastname: string;
    };
    address: {
        street: string;
        city: string;
        zipcode: string;
    };
    phone: string;
}

type ConnectionStatus = 'none' | 'pending' | 'connected' | 'requested';
type CategoryTab = 'connected' | 'requests' | 'suggestions';

export default function DealersDetails() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [connectionStatus, setConnectionStatus] = React.useState<Record<number, ConnectionStatus>>({});
    const [activeTab, setActiveTab] = React.useState<CategoryTab>('connected');
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        fetch('https://fakestoreapi.com/users')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                const initialStatuses: Record<number, ConnectionStatus> = {};
                data.forEach((user: User) => {
                    const randomStatus = Math.floor(Math.random() * 4);
                    initialStatuses[user.id] = ['none', 'pending', 'connected', 'requested'][randomStatus] as ConnectionStatus;
                });
                setConnectionStatus(initialStatuses);
            })
            .catch((error) => console.error('Error fetching dealers:', error));
    }, []);

    const handleTabChange = (_: React.SyntheticEvent, newTab: CategoryTab) => {
        setActiveTab(newTab);
        setPage(1);
    };

    const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleConnectionAction = (userId: number, currentStatus: ConnectionStatus) => {
        const newStatus: Record<number, ConnectionStatus> = { ...connectionStatus };

        switch (currentStatus) {
            case 'none':
                newStatus[userId] = 'pending';
                break;
            case 'connected':
                newStatus[userId] = 'none';
                break;
            case 'pending':
                newStatus[userId] = 'none';
                break;
            case 'requested':
                newStatus[userId] = 'connected';
                break;
        }

        setConnectionStatus(newStatus);
    };

    // Filter users based on active tab
    const filteredUsers = users.filter(user => {
        switch (activeTab) {
            case 'connected':
                return connectionStatus[user.id] === 'connected';
            case 'requests':
                return connectionStatus[user.id] === 'requested';
            case 'suggestions':
                return connectionStatus[user.id] === 'none' || connectionStatus[user.id] === 'pending';
            default:
                return true;
        }
    });

    // Pagination
    const itemsPerPage = 8;
    const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const displayedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    // Get connection action button based on status
    const getConnectionButton = (userId: number, status: ConnectionStatus) => {
        switch (status) {
            case 'none':
                return (
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleConnectionAction(userId, status)}
                        fullWidth
                    >
                        Connect
                    </Button>
                );
            case 'connected':
                return (
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<PersonRemoveIcon />}
                        onClick={() => handleConnectionAction(userId, status)}
                        fullWidth
                    >
                        Disconnect
                    </Button>
                );
            case 'pending':
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<PendingIcon />}
                        onClick={() => handleConnectionAction(userId, status)}
                        fullWidth
                    >
                        Cancel Request
                    </Button>
                );
            case 'requested':
                return (
                    <Box sx={{ width: '100%' }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<HowToRegIcon />}
                            onClick={() => handleConnectionAction(userId, status)}
                            fullWidth
                            sx={{ mb: 1 }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleConnectionAction(userId, 'none')}
                            fullWidth
                        >
                            Decline
                        </Button>
                    </Box>
                );
        }
    };

    // Get status chip for display in card
    const getConnectionChip = (status: ConnectionStatus) => {
        switch (status) {
            case 'connected':
                return <Chip
                    icon={<HandshakeIcon />}
                    label="Connected"
                    color="success"
                    size="small"
                    variant="outlined"
                />;
            case 'pending':
                return <Chip
                    icon={<PendingIcon />}
                    label="Request Sent"
                    color="primary"
                    size="small"
                    variant="outlined"
                />;
            case 'requested':
                return <Chip
                    icon={<BusinessIcon />}
                    label="Wants to connect"
                    color="secondary"
                    size="small"
                    variant="outlined"
                />;
            default:
                return null;
        }
    };

    // Count users by category
    const connectedCount = users.filter(user => connectionStatus[user.id] === 'connected').length;
    const requestsCount = users.filter(user => connectionStatus[user.id] === 'requested').length;
    const suggestionsCount = users.filter(user => connectionStatus[user.id] === 'none' || connectionStatus[user.id] === 'pending').length;

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                        minHeight: { xs: 48, sm: 64 },
                        // Make text responsive
                        '& .MuiTab-wrapper': {
                            flexDirection: { xs: 'column', sm: 'row' }
                        },
                        // Adjust padding and size based on screen
                        p: { xs: 1, sm: 2 },
                        minWidth: { xs: 'auto', sm: 160 }
                    }
                }}
                aria-label="dealer categories"
            >
                <Tab
                    icon={<HandshakeIcon />}
                    iconPosition="start"
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Connected Dealers
                            </Typography>
                            <Typography component="span" sx={{ ml: { xs: 0, sm: 0.5 } }}>
                                ({connectedCount})
                            </Typography>
                        </Box>
                    }
                    value="connected"
                />
                <Tab
                    icon={<BusinessIcon />}
                    iconPosition="start"
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Connection Requests
                            </Typography>
                            <Typography component="span" sx={{ ml: { xs: 0, sm: 0.5 } }}>
                                ({requestsCount})
                            </Typography>
                        </Box>
                    }
                    value="requests"
                />
                <Tab
                    icon={<RecommendIcon />}
                    iconPosition="start"
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Recommended Dealers
                            </Typography>
                            <Typography component="span" sx={{ ml: { xs: 0, sm: 0.5 } }}>
                                ({suggestionsCount})
                            </Typography>
                        </Box>
                    }
                    value="suggestions"
                />
            </Tabs>

            <Typography variant="h6" sx={{ mb: 2 }}>
                {activeTab === 'connected' && 'Your Connected Dealers'}
                {activeTab === 'requests' && 'Dealer Connection Requests'}
                {activeTab === 'suggestions' && 'Recommended Dealers'}
            </Typography>

            {displayedUsers.length > 0 ? (
                <Grid container spacing={2}>
                    {displayedUsers.map((user) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    overflow: 'hidden',
                                    border: '1px solid #c8e6c9',  // Light green border
                                    borderRadius: 2,
                                    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.15)',
                                    '&:hover': {
                                        boxShadow: '0 8px 16px rgba(46, 125, 50, 0.25)',
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                {/* Status indicator stripe */}
                                <Box sx={{
                                    height: '6px',
                                    backgroundColor: connectionStatus[user.id] === 'connected' ? '#2e7d32' :
                                        connectionStatus[user.id] === 'requested' ? '#ff9800' :
                                            connectionStatus[user.id] === 'pending' ? '#1976d2' : '#9e9e9e'
                                }} />
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: connectionStatus[user.id] === 'connected' ? '#2e7d32' : // Dark green
                                                    connectionStatus[user.id] === 'requested' ? '#e65100' : // Orange
                                                        connectionStatus[user.id] === 'pending' ? '#0d47a1' : '#546e7a', // Blue or grey
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {user.name.firstname[0]}{user.name.lastname[0]}
                                        </Avatar>
                                    }
                                    title={
                                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                            {user.name.firstname} {user.name.lastname}
                                        </Typography>
                                    }
                                    action={getConnectionChip(connectionStatus[user.id])}
                                />
                                <CardContent sx={{
                                    flexGrow: 1,
                                    backgroundColor: 'rgba(240, 247, 235, 0.4)',
                                    pt: 2
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <EmailIcon fontSize="small" sx={{ mr: 1, color: '#558b2f' }} />
                                        <Typography variant="body2">{user.email}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: '#558b2f' }} />
                                        <Typography variant="body2">{user.phone}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.3, color: '#558b2f' }} />
                                        <Typography variant="body2">
                                            {user.address.city}, {user.address.zipcode}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <Divider sx={{ borderColor: '#c8e6c9' }} />
                                <CardActions sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(240, 247, 235, 0.6)'
                                }}>
                                    {getConnectionButton(user.id, connectionStatus[user.id])}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center" py={5}>
                    {activeTab === 'connected' && 'You have no connected dealers yet.'}
                    {activeTab === 'requests' && 'You have no connection requests.'}
                    {activeTab === 'suggestions' && 'No dealer recommendations available right now.'}
                </Typography>
            )}

            {filteredUsers.length > itemsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
}