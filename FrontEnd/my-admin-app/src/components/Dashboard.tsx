import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardHeader,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ShoppingCart as ShoppingCartIcon,
    Storefront as StorefrontIcon,
    TrendingUp as TrendingUpIcon,
    Notifications as NotificationsIcon,
    AttachMoney as AttachMoneyIcon,
    UploadFile as UploadFileIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ApiConfig from '../utils/ApiConfig';

// Define interface for user report data
interface UserReportData {
    shared_buying_post_count: string;
    total_cost: string;
    total_profit: string;
    shared_selling_post_count: string;
}

// Define interface for dashboard summary
interface DashboardSummary {
    totalSellingPosts: number;
    totalBuyingPosts: number;
    totalProfit: number;
    totalCost: number;
    notificationCount: number;
}

const StyledPaper = styled(Paper)(({ }) => ({
    padding: '16px',
    height: '100%'
}));

const StyledCard = styled(Card)(({ }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
}));

const SummaryCard = ({ title, value, icon, color, isLoading }: { 
    title: string, 
    value: string, 
    icon: React.ReactNode, 
    color: string,
    isLoading?: boolean 
}) => (
    <Card sx={{ bgcolor: color, color: 'white', minHeight: 120 }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="overline" sx={{ opacity: 0.8 }}>
                        {title}
                    </Typography>
                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: 'white', mt: 1 }} />
                    ) : (
                        <Typography variant="h4" fontWeight="bold">
                            {value}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ opacity: 0.8 }}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const [userReport, setUserReport] = useState<UserReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary>({
        totalSellingPosts: 0,
        totalBuyingPosts: 0,
        totalProfit: 0,
        totalCost: 0,
        notificationCount: 5, // Static for now
    });

    // Fetch user report data from API
    const fetchUserReport = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('Fetching user report from:', `${ApiConfig.Domain}/userreport`);
            
            const response = await fetch(`${ApiConfig.Domain}/userreport`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: UserReportData = await response.json();
            console.log('User report data received:', data);
            
            setUserReport(data);
            
            // Update dashboard summary with API data
            setDashboardSummary({
                totalSellingPosts: parseInt(data.shared_selling_post_count) || 0,
                totalBuyingPosts: parseInt(data.shared_buying_post_count) || 0,
                totalProfit: parseFloat(data.total_profit) || 0,
                totalCost: parseFloat(data.total_cost) || 0,
                notificationCount: 5, // Static for now
            });
            
        } catch (err) {
            console.error('Error fetching user report:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch user report');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchUserReport();
    }, []);

    // Format currency values
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value).replace('LKR', 'Rs');
    };

    // Sample JSON for selling item deals
    const sellingItems = [
        { id: 1, name: 'Tomatoes', category: 'Vegetables' },
        { id: 2, name: 'Carrots', category: 'Vegetables' },
        { id: 3, name: 'Mango', category: 'Fruit' }
    ];

    // Mock data for recent items
    const recentItems = [
        { id: 1, name: 'Tomatoes', price: -2.50, category: 'Vegetables' },
        { id: 2, name: 'Red Snapper', price: 12.75, category: 'Fish' },
        { id: 3, name: 'Carrots', price: -1.20, category: 'Vegetables' },
        { id: 4, name: 'Tuna', price: 15.40, category: 'Fish' }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    📊 User Market Dashboard
                </Typography>
                <Button
                    variant="outlined"
                    onClick={fetchUserReport}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
                    sx={{ textTransform: 'none' }}
                >
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 3 }}
                    action={
                        <Button color="inherit" size="small" onClick={fetchUserReport}>
                            Retry
                        </Button>
                    }
                >
                    Error loading dashboard data: {error}
                </Alert>
            )}

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="🛒 Selling Posts"
                        value={dashboardSummary.totalSellingPosts.toString()}
                        icon={<StorefrontIcon fontSize="large" />}
                        color="#4caf50"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="🛍️ Buying Posts"
                        value={dashboardSummary.totalBuyingPosts.toString()}
                        icon={<ShoppingCartIcon fontSize="large" />}
                        color="#2196f3"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="💰 Total Profit"
                        value={isLoading ? '...' : formatCurrency(dashboardSummary.totalProfit)}
                        icon={<TrendingUpIcon fontSize="large" />}
                        color="#ff9800"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="💸 Total Cost"
                        value={isLoading ? '...' : formatCurrency(dashboardSummary.totalCost)}
                        icon={<AttachMoneyIcon fontSize="large" />}
                        color="#f44336"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="🔔 Notifications"
                        value={dashboardSummary.notificationCount.toString()}
                        icon={
                            <Badge
                                color="error"
                                variant="dot"
                                invisible={dashboardSummary.notificationCount === 0}
                            >
                                <NotificationsIcon fontSize="large" />
                            </Badge>
                        }
                        color="#5499c7"
                        isLoading={false}
                    />
                </Grid>
            </Grid>

            {/* API Data Display Section */}
            {userReport && !isLoading && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, bgcolor: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'success.main' }}>
                                📈 Latest Report Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                                        <Typography variant="h4" color="success.main" fontWeight="bold">
                                            {userReport.shared_selling_post_count}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Selling Posts
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                                            {userReport.shared_buying_post_count}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Buying Posts
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                                            {formatCurrency(parseFloat(userReport.total_profit))}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Profit
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                                        <Typography variant="h4" color="error.main" fontWeight="bold">
                                            {formatCurrency(parseFloat(userReport.total_cost))}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Cost
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Main Dashboard Content */}
            <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardHeader title="🚀 Quick Actions" />
                        <Divider />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button
                                        component={Link}
                                        to="/reports"
                                        variant="contained"
                                        color="success"
                                        startIcon={<UploadFileIcon />}
                                        fullWidth
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Upload CSV
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Generate Report
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Price Analysis
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        sx={{ textTransform: 'none' }}
                                        onClick={fetchUserReport}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Loading...' : 'Refresh'}
                                    </Button>
                                </Grid>
                            </Grid>
                            
                            <Box mt={3}>
                                <StyledCard>
                                    <CardHeader title="🛒 Selling Item Deals" />
                                    <Divider />
                                    <CardContent>
                                        {sellingItems && sellingItems.length > 0 ? (
                                            sellingItems.map((item) => (
                                                <Box
                                                    key={item.id}
                                                    sx={{
                                                        mb: 1,
                                                        p: 2,
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: 2,
                                                        bgcolor: '#f5f5f5',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            bgcolor: '#e8f5e8',
                                                            borderColor: '#4caf50'
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {item.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="success.main">
                                                        📦 {item.category}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No items to display
                                            </Typography>
                                        )}
                                    </CardContent>
                                </StyledCard>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Recent Updates */}
                <Grid item xs={12} md={8}>
                    <StyledCard>
                        <CardHeader title="📈 Recent Price Updates" />
                        <Divider />
                        <List sx={{ flexGrow: 1 }}>
                            {recentItems.map(item => (
                                <ListItem key={item.id} divider>
                                    <ListItemIcon>
                                        {item.price > 0 ? (
                                            <TrendingUpIcon color="success" />
                                        ) : (
                                            <TrendingDownIcon color="error" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${item.name} - Rs ${Math.abs(item.price).toFixed(2)}`}
                                        secondary={`📦 ${item.category} • ${item.price > 0 ? 'Price Increased' : 'Price Decreased'}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Box sx={{ p: 2 }}>
                            <Button
                                component={Link}
                                to="/reports"
                                size="small"
                                color="primary"
                                sx={{ textTransform: 'none' }}
                            >
                                📊 View All Items
                            </Button>
                        </Box>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
}