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
    Alert,
    useTheme,
    useMediaQuery
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
import UserReportCharts from './charts/UserReportCharts';

// Define interface for user report data
interface UserReportData {
    shared_buying_post_count: string;
    total_cost: string;
    total_profit: string;
    shared_selling_post_count: string;
}

// Define interface for recent items from API
interface RecentItem {
    id: number;
    name: string;
    priceChanges: number; // Changed from price to priceChanges
    category: string;
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
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Card sx={{ 
            bgcolor: color, 
            color: 'white', 
            minHeight: isMobile ? 100 : 120,
            boxShadow: 3,
            borderRadius: 2
        }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography 
                            variant={isMobile ? "caption" : "overline"} 
                            sx={{ 
                                opacity: 0.8,
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                display: 'block',
                                mb: 0.5
                            }}
                        >
                            {title}
                        </Typography>
                        {isLoading ? (
                            <CircularProgress size={isMobile ? 20 : 24} sx={{ color: 'white', mt: 1 }} />
                        ) : (
                            <Typography 
                                variant={isMobile ? "h6" : "h4"} 
                                fontWeight="bold"
                                sx={{ 
                                    fontSize: isMobile ? '1.1rem' : '2.125rem',
                                    lineHeight: isMobile ? 1.2 : 1,
                                    wordBreak: 'break-word'
                                }}
                            >
                                {value}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ 
                        opacity: 0.8,
                        mt: isMobile ? 1 : 0,
                        ml: isMobile ? 0 : 2
                    }}>
                        {React.cloneElement(icon as React.ReactElement, {
                            fontSize: isMobile ? 'medium' : 'large'
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

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

    // Add state for recent items
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
    const [sellingItems, setSellingItems] = useState<RecentItem[]>([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [itemsError, setItemsError] = useState<string | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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

    // Fetch recent items data from API
    const fetchRecentItems = async () => {
        try {
            setIsLoadingItems(true);
            setItemsError(null);
            
            console.log('Fetching recent items from:', `${ApiConfig.Domain}/userreport/recent-items`);
            
            const response = await fetch(`${ApiConfig.Domain}/userreport/recent-items`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: RecentItem[] = await response.json();
            console.log('Recent items data received:', data);
            
            setRecentItems(data);
            
            // Filter items by category for selling deals
            // Get unique items from different categories for variety
            const categoryGroups = data.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
            }, {} as Record<string, RecentItem[]>);
            
            // Get one item from each category for selling deals, max 6 items
            const sellingDeals: RecentItem[] = [];
            Object.values(categoryGroups).forEach(categoryItems => {
                if (sellingDeals.length < 6) {
                    sellingDeals.push(categoryItems[0]); // Take first item from each category
                }
            });
            
            setSellingItems(sellingDeals);
            
        } catch (err) {
            console.error('Error fetching recent items:', err);
            setItemsError(err instanceof Error ? err.message : 'Failed to fetch recent items');
            // Fallback to empty arrays
            setRecentItems([]);
            setSellingItems([]);
        } finally {
            setIsLoadingItems(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchUserReport();
        fetchRecentItems();

        // Set up auto-refresh every 30 seconds
        const interval = setInterval(() => {
            console.log('Auto-refreshing dashboard data...');
            fetchUserReport();
            fetchRecentItems();
        }, 30000); // 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
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

    // Remove the old getCategoryIcon function completely

    // Remove the old getPriceChangeInfo function and create a new one
    const getPriceChangeInfo = (item: RecentItem) => {
        return {
            price: item.priceChanges,
            isIncrease: item.priceChanges > 0
        };
    };

    // Function to format price change display
    const formatPriceChange = (priceChange: number): string => {
        const prefix = priceChange > 0 ? '+' : '';
        return `${prefix}Rs. ${priceChange.toFixed(2)}`;
    };

    return (
        <Box sx={{ 
            p: isMobile ? 2 : 3,
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                mb: isMobile ? 3 : 4,
                gap: isMobile ? 2 : 0
            }}>
                <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    component="h1" 
                    sx={{ 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '1.5rem' : '2.125rem'
                    }}
                >
                    📊 Market Dashboard
                </Typography>
                
            </Box>

            {/* Error Alerts */}
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 3,
                        '& .MuiAlert-message': {
                            fontSize: isMobile ? '0.875rem' : '1rem'
                        }
                    }}
                >
                    Error loading dashboard data: {error}
                </Alert>
            )}

            {itemsError && (
                <Alert 
                    severity="warning" 
                    sx={{ 
                        mb: 3,
                        '& .MuiAlert-message': {
                            fontSize: isMobile ? '0.875rem' : '1rem'
                        }
                    }}
                >
                    Error loading recent items: {itemsError}
                </Alert>
            )}

            {/* Summary Cards - Responsive Grid */}
            <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard
                        title="Selling Posts"
                        value={dashboardSummary.totalSellingPosts.toString()}
                        icon={<StorefrontIcon />}
                        color="#4caf50"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard
                        title="Buying Posts"
                        value={dashboardSummary.totalBuyingPosts.toString()}
                        icon={<ShoppingCartIcon />}
                        color="#2196f3"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard
                        title="Total Profit"
                        value={isLoading ? '...' : formatCurrency(dashboardSummary.totalProfit)}
                        icon={<TrendingUpIcon />}
                        color="#ff9800"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard
                        title="Total Cost"
                        value={isLoading ? '...' : formatCurrency(dashboardSummary.totalCost)}
                        icon={<AttachMoneyIcon />}
                        color="#f44336"
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>

            {/* API Data Display Section - Mobile Responsive */}
            {userReport && !isLoading && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Paper sx={{ 
                            p: isMobile ? 2 : 3, 
                            bgcolor: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)',
                            borderRadius: 2
                        }}>
                            <Typography 
                                variant={isMobile ? "subtitle1" : "h6"} 
                                sx={{ 
                                    mb: 2, 
                                    fontWeight: 'bold', 
                                    color: 'success.main',
                                    textAlign: isMobile ? 'center' : 'left'
                                }}
                            >
                                📈 Latest Report Summary
                            </Typography>
                            <Grid container spacing={isMobile ? 1 : 2}>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        p: isMobile ? 1.5 : 2, 
                                        bgcolor: 'white', 
                                        borderRadius: 2 
                                    }}>
                                        <Typography 
                                            variant={isMobile ? "h6" : "h4"} 
                                            color="success.main" 
                                            fontWeight="bold"
                                            sx={{ fontSize: isMobile ? '1.25rem' : '2.125rem' }}
                                        >
                                            {userReport.shared_selling_post_count}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                                        >
                                            Selling Posts
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        p: isMobile ? 1.5 : 2, 
                                        bgcolor: 'white', 
                                        borderRadius: 2 
                                    }}>
                                        <Typography 
                                            variant={isMobile ? "h6" : "h4"} 
                                            color="primary.main" 
                                            fontWeight="bold"
                                            sx={{ fontSize: isMobile ? '1.25rem' : '2.125rem' }}
                                        >
                                            {userReport.shared_buying_post_count}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                                        >
                                            Buying Posts
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        p: isMobile ? 1.5 : 2, 
                                        bgcolor: 'white', 
                                        borderRadius: 2 
                                    }}>
                                        <Typography 
                                            variant={isMobile ? "body1" : "h4"} 
                                            color="warning.main" 
                                            fontWeight="bold"
                                            sx={{ 
                                                fontSize: isMobile ? '1rem' : '2.125rem',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {formatCurrency(parseFloat(userReport.total_profit))}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                                        >
                                            Total Profit
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        p: isMobile ? 1.5 : 2, 
                                        bgcolor: 'white', 
                                        borderRadius: 2 
                                    }}>
                                        <Typography 
                                            variant={isMobile ? "body1" : "h4"} 
                                            color="error.main" 
                                            fontWeight="bold"
                                            sx={{ 
                                                fontSize: isMobile ? '1rem' : '2.125rem',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {formatCurrency(parseFloat(userReport.total_cost))}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                                        >
                                            Total Cost
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Main Dashboard Content - Mobile Responsive Layout */}
            <Grid container spacing={isMobile ? 2 : 3}>
                {/* Charts Section - Full Width */}
                <Grid item xs={12}>
                    <UserReportCharts />
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardHeader 
                            title="🚀 Quick Actions" 
                            titleTypographyProps={{
                                variant: isMobile ? 'subtitle1' : 'h6'
                            }}
                        />
                        <Divider />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Grid container spacing={isMobile ? 1.5 : 2}>
                                <Grid item xs={6}>
                                    <Button
                                        component={Link}
                                        to="/reports"
                                        variant="contained"
                                        color="success"
                                        startIcon={<UploadFileIcon />}
                                        fullWidth
                                        size={isMobile ? "small" : "medium"}
                                        sx={{ 
                                            textTransform: 'none',
                                            fontSize: isMobile ? '0.75rem' : '0.875rem'
                                        }}
                                    >
                                        Upload CSV
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        size={isMobile ? "small" : "medium"}
                                        sx={{ 
                                            textTransform: 'none',
                                            fontSize: isMobile ? '0.75rem' : '0.875rem'
                                        }}
                                    >
                                        Generate Report
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        size={isMobile ? "small" : "medium"}
                                        sx={{ 
                                            textTransform: 'none',
                                            fontSize: isMobile ? '0.75rem' : '0.875rem'
                                        }}
                                    >
                                        Price Analysis
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth
                                        size={isMobile ? "small" : "medium"}
                                        disabled={isLoading}
                                        sx={{ 
                                            textTransform: 'none',
                                            fontSize: isMobile ? '0.75rem' : '0.875rem'
                                        }}
                                    >
                                        {isLoading ? 'Loading...' : 'Manual Refresh'}
                                    </Button>
                                </Grid>
                            </Grid>
                            
                            <Box mt={isMobile ? 2 : 3}>
                                <StyledCard>
                                    <CardHeader 
                                        title="Recent Market Items" 
                                        titleTypographyProps={{
                                            variant: isMobile ? 'body1' : 'subtitle1'
                                        }}
                                    />
                                    <Divider />
                                    <CardContent>
                                        {isLoadingItems ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                                <CircularProgress size={24} />
                                            </Box>
                                        ) : sellingItems && sellingItems.length > 0 ? (
                                            sellingItems.map((item) => (
                                                <Box
                                                    key={item.id}
                                                    sx={{
                                                        mb: 1,
                                                        p: isMobile ? 1.5 : 2,
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
                                                    <Typography 
                                                        variant={isMobile ? "body2" : "body1"} 
                                                        fontWeight="medium"
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        color="success.main" 
                                                        sx={{ mt: 0.5, display: 'block' }}
                                                    >
                                                        {item.category}
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        color={item.priceChanges > 0 ? 'error.main' : 'success.main'}
                                                        fontWeight="bold"
                                                        sx={{ mt: 0.5, display: 'block' }}
                                                    >
                                                        {formatPriceChange(item.priceChanges)}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                {itemsError ? 'Failed to load items' : 'No items to display'}
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
                        <CardHeader 
                            title="Recent Price Updates" 
                            titleTypographyProps={{
                                variant: isMobile ? 'subtitle1' : 'h6'
                            }}
                        />
                        <Divider />
                        <List sx={{ flexGrow: 1 }}>
                            {isLoadingItems ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : recentItems && recentItems.length > 0 ? (
                                recentItems.slice(0, isMobile ? 6 : 8).map((item) => {
                                    const priceChange = getPriceChangeInfo(item);
                                    return (
                                        <ListItem key={item.id} divider>
                                            <ListItemIcon>
                                                {priceChange.isIncrease ? (
                                                    <TrendingUpIcon color="error" />
                                                ) : (
                                                    <TrendingDownIcon color="success" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: isMobile ? 'flex-start' : 'center', 
                                                        gap: 1,
                                                        flexDirection: isMobile ? 'column' : 'row'
                                                    }}>
                                                        <Typography 
                                                            variant={isMobile ? "body2" : "body1"} 
                                                            fontWeight="medium"
                                                        >
                                                            {item.name}
                                                        </Typography>
                                                        <Typography 
                                                            variant="body2" 
                                                            color={priceChange.isIncrease ? 'error.main' : 'success.main'}
                                                            fontWeight="medium"
                                                        >
                                                            {formatPriceChange(item.priceChanges)}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" component="span">
                                                        {item.category} • {priceChange.isIncrease ? 'Price Increased' : 'Price Decreased'}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    );
                                })
                            ) : (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                                {itemsError ? 'Failed to load recent price updates' : 'No recent price updates available'}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                        <Box sx={{ p: 2 }}>
                            <Button
                                component={Link}
                                to="/reports"
                                size="small"
                                color="primary"
                                sx={{ textTransform: 'none' }}
                                startIcon={<StorefrontIcon />}
                            >
                                View All Items
                            </Button>
                        </Box>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
}