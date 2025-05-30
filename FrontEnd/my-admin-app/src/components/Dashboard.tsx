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
    ListItemIcon
} from '@mui/material';
import {
    ShoppingCart as ShoppingCartIcon,
    Storefront as StorefrontIcon,
    TrendingUp as TrendingUpIcon,
    // Remove unused import
    Notifications as NotificationsIcon,
    AttachMoney as AttachMoneyIcon,
    UploadFile as UploadFileIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';


// Define interface for market summary
interface MarketSummary {
    totalSellingItems: number;
    totalBuyingItems: number;
    notificationCount: number;
    sellingProfit: number;
    buyingCost: number,
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

const SummaryCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
    <Card sx={{ bgcolor: color, color: 'white' }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="overline">{title}</Typography>
                    <Typography variant="h4" fontWeight="bold">{value}</Typography>
                </Box>
                <Box>{icon}</Box>
            </Box>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const [summary, setSummary] = useState<MarketSummary>({
        totalSellingItems: 10,
        totalBuyingItems: 10,
        sellingProfit: 10,
        buyingCost: 10,
        notificationCount: 10,
    });

    // Sample JSON for selling item deals - ensuring it's correctly defined
    const sellingItems = [
        { id: 1, name: 'Tomatoes', category: 'Vegetables' },
        { id: 2, name: 'Carrots', category: 'Vegetables' },
        { id: 2, name: 'Mango', category: 'Fruit' }
    ];

    // Debug log to verify data
    console.log('Selling Items:', sellingItems);

    // Mock data - replace with actual data from your CSV JSON
    const recentItems = [
        { id: 1, name: 'Tomatoes', price: -2.50, category: 'Vegetables' },
        { id: 2, name: 'Red Snapper', price: 12.75, category: 'Fish' },
        { id: 3, name: 'Carrots', price: -1.20, category: 'Vegetables' },
        { id: 4, name: 'Tuna', price: 15.40, category: 'Fish' }
    ];

    const specialNotes = [
        { category: 'Vegetables', note: 'Fresh tomato supplies limited due to recent weather conditions.' },
        { category: 'Fish', note: 'High quality tuna available this week. Special discount on bulk orders.' }
    ];

    // Calculate summary from localStorage or other data source
    useEffect(() => {
        // Try to get market data from localStorage
        try {
            const storedData = localStorage.getItem('marketData');
            if (storedData) {
                const marketData = JSON.parse(storedData);

                // Extract summary information - fixed type issues
                const newSummary: Partial<MarketSummary> = {
                    totalSellingItems: marketData.items?.length || 0,
                    totalBuyingItems: new Set(marketData.items?.map((item: {category: string}) => item.category)).size || 0,
                    latestUpdate: marketData.metadata?.dateProcessed ?
                        Date.parse(marketData.metadata.dateProcessed) : Date.now(),
                    sellingProfit: Math.floor(Math.random() * 20) // Replace with actual data
                };

                setSummary(prev => ({...prev, ...newSummary}));
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                User Market Dashboard
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Total Selling Item"
                        value={summary.totalSellingItems.toString()}
                        icon={<StorefrontIcon fontSize="large" />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Total Buying Item"
                        value={summary.totalBuyingItems.toString()}
                        icon={<ShoppingCartIcon fontSize="large" />}
                        color="#2196f3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Selling Profit"
                        value={`Rs ${summary.buyingCost.toString()}`}
                        icon={<AttachMoneyIcon fontSize="large" />}
                        color="#ff9800"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Buying Cost"
                        value={`Rs ${summary.buyingCost.toString()}`}
                        icon={<AttachMoneyIcon fontSize="large" />}
                        color="#f44336"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Notification"
                        value={summary.notificationCount.toString()}
                        icon={
                            <Badge
                                color="error"
                                variant="dot"
                                invisible={summary.notificationCount === 0}
                            >
                                <NotificationsIcon fontSize="large" />
                            </Badge>
                        }
                        color="#5499c7"
                    />
                </Grid>
            </Grid>

            {/* Main Dashboard Content */}
            <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardHeader title="Quick Actions" />
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
                                    >
                                        Upload CSV
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" fullWidth>
                                        Generate Report
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" fullWidth>
                                        Price Analysis
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" fullWidth>
                                        Settings
                                    </Button>
                                </Grid>
                            </Grid>
                            <Box mt={2}>
                                <StyledCard>
                                    <CardHeader title="Selling Item Deals" />
                                    <Divider />
                                    <CardContent>
                                        {sellingItems && sellingItems.length > 0 ? (
                                            sellingItems.map((item) => (
                                                <Box
                                                    key={item.id}
                                                    sx={{
                                                        mb: 1,
                                                        p: 1,
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: 1,
                                                        bgcolor: '#f5f5f5'
                                                    }}
                                                >
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {item.name} - <span style={{ color: '#4caf50' }}>{item.category}</span>
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2">No items to display</Typography>
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
                        <CardHeader title="Recent Price Updates" />
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
                                        primary={`${item.name} - Rs ${item.price.toFixed(2)}`}
                                        secondary={item.category}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Box sx={{ p: 1 }}>
                            <Button
                                component={Link}
                                to="/reports"
                                size="small"
                                color="primary"
                            >
                                View All Items
                            </Button>
                        </Box>
                    </StyledCard>
                </Grid>

                {/* Special Notes */}
                {/*<Grid item xs={12}>
                    <StyledPaper elevation={2}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Special Market Notes</Typography>
                        <Grid container spacing={2}>
                            {specialNotes.map((note, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography color="primary" fontWeight="bold" gutterBottom>
                                                {note.category}
                                            </Typography>
                                            <Typography variant="body2">
                                                {note.note}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </StyledPaper>
                </Grid>*/}
            </Grid>
        </Box>
    );
}