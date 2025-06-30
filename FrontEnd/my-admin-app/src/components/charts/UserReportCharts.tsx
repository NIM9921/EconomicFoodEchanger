import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    useTheme,
    useMediaQuery,
    ToggleButton,
    ToggleButtonGroup,
    Chip
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Area,
    AreaChart
} from 'recharts';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    BarChart as BarChartIcon,
    ShowChart as LineChartIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import ApiConfig from '../../utils/ApiConfig';

// Interfaces for API response data
interface BuyingCostData {
    postSharedDate: string | null;
    totalCost: number;
}

interface SellingProfitData {
    totalProfit: number;
    postSharedDate: string;
}

// Combined data interface for charts
interface ChartDataPoint {
    date: string;
    formattedDate: string;
    buyingCost: number;
    sellingProfit: number;
    netProfit: number;
}

// Chart type enum
type ChartType = 'line' | 'bar' | 'area' | 'composed';

const UserReportCharts: React.FC = () => {
    const [buyingData, setBuyingData] = useState<BuyingCostData[]>([]);
    const [sellingData, setSellingData] = useState<SellingProfitData[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [chartType, setChartType] = useState<ChartType>('line');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // Fetch buying cost data
    const fetchBuyingCostData = async () => {
        try {
            const response = await fetch(`${ApiConfig.Domain}/userreport/getBuyingRequestCost`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: BuyingCostData[] = await response.json();
            console.log('Buying cost data:', data);
            setBuyingData(data);
            return data;
        } catch (err) {
            console.error('Error fetching buying cost data:', err);
            throw err;
        }
    };

    // Fetch selling profit data
    const fetchSellingProfitData = async () => {
        try {
            const response = await fetch(`${ApiConfig.Domain}/userreport/getSellingRequestProfit`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: SellingProfitData[] = await response.json();
            console.log('Selling profit data:', data);
            setSellingData(data);
            return data;
        } catch (err) {
            console.error('Error fetching selling profit data:', err);
            throw err;
        }
    };

    // Format date for display
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'No Date';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // Get short date for chart axis
    const getShortDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'N/A';
        }
    };

    // Combine and process data for charts
    const processChartData = (buying: BuyingCostData[], selling: SellingProfitData[]) => {
        const dateMap = new Map<string, ChartDataPoint>();

        // Process buying data
        buying.forEach(item => {
            const dateKey = item.postSharedDate || 'no-date';
            const formattedDate = getShortDate(item.postSharedDate);
            
            if (dateMap.has(dateKey)) {
                const existing = dateMap.get(dateKey)!;
                existing.buyingCost += item.totalCost;
            } else {
                dateMap.set(dateKey, {
                    date: dateKey,
                    formattedDate,
                    buyingCost: item.totalCost,
                    sellingProfit: 0,
                    netProfit: -item.totalCost
                });
            }
        });

        // Process selling data
        selling.forEach(item => {
            const dateKey = item.postSharedDate;
            const formattedDate = getShortDate(item.postSharedDate);
            
            if (dateMap.has(dateKey)) {
                const existing = dateMap.get(dateKey)!;
                existing.sellingProfit += item.totalProfit;
                existing.netProfit = existing.sellingProfit - existing.buyingCost;
            } else {
                dateMap.set(dateKey, {
                    date: dateKey,
                    formattedDate,
                    buyingCost: 0,
                    sellingProfit: item.totalProfit,
                    netProfit: item.totalProfit
                });
            }
        });

        // Convert to array and sort by date
        const chartArray = Array.from(dateMap.values())
            .filter(item => item.date !== 'no-date') // Remove items without dates
            .sort((a, b) => {
                if (a.date === 'no-date') return 1;
                if (b.date === 'no-date') return -1;
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

        console.log('Processed chart data:', chartArray);
        return chartArray;
    };

    // Fetch all data
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [buyingResult, sellingResult] = await Promise.all([
                fetchBuyingCostData(),
                fetchSellingProfitData()
            ]);

            const processedData = processChartData(buyingResult, sellingResult);
            setChartData(processedData);

        } catch (err) {
            console.error('Error fetching chart data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Calculate summary statistics
    const getSummaryStats = () => {
        const totalBuyingCost = chartData.reduce((sum, item) => sum + item.buyingCost, 0);
        const totalSellingProfit = chartData.reduce((sum, item) => sum + item.sellingProfit, 0);
        const totalNetProfit = totalSellingProfit - totalBuyingCost;

        return {
            totalBuyingCost,
            totalSellingProfit,
            totalNetProfit,
            avgBuyingCost: chartData.length > 0 ? totalBuyingCost / chartData.length : 0,
            avgSellingProfit: chartData.length > 0 ? totalSellingProfit / chartData.length : 0
        };
    };

    // Format currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value).replace('LKR', 'Rs');
    };

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    bgcolor: 'white',
                    p: 2,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    boxShadow: 2
                }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        {label}
                    </Typography>
                    {payload.map((entry: any, index: number) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    // Render different chart types
    const renderChart = () => {
        const commonProps = {
            data: chartData,
            margin: { top: 5, right: 30, left: 20, bottom: 5 }
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="formattedDate" 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            interval={isMobile ? 1 : 0}
                        />
                        <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="buyingCost" 
                            stroke="#f44336" 
                            strokeWidth={2}
                            name="Buying Cost"
                            dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="sellingProfit" 
                            stroke="#4caf50" 
                            strokeWidth={2}
                            name="Selling Profit"
                            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="netProfit" 
                            stroke="#2196f3" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Net Profit"
                            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                );

            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="formattedDate" 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            interval={isMobile ? 1 : 0}
                        />
                        <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="buyingCost" fill="#f44336" name="Buying Cost" />
                        <Bar dataKey="sellingProfit" fill="#4caf50" name="Selling Profit" />
                    </BarChart>
                );

            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="formattedDate" 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            interval={isMobile ? 1 : 0}
                        />
                        <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="buyingCost" 
                            stackId="1"
                            stroke="#f44336" 
                            fill="#f44336"
                            fillOpacity={0.6}
                            name="Buying Cost"
                        />
                        <Area 
                            type="monotone" 
                            dataKey="sellingProfit" 
                            stackId="2"
                            stroke="#4caf50" 
                            fill="#4caf50"
                            fillOpacity={0.6}
                            name="Selling Profit"
                        />
                    </AreaChart>
                );

            case 'composed':
                return (
                    <ComposedChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="formattedDate" 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            interval={isMobile ? 1 : 0}
                        />
                        <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="buyingCost" fill="#f44336" name="Buying Cost" />
                        <Line 
                            type="monotone" 
                            dataKey="sellingProfit" 
                            stroke="#4caf50" 
                            strokeWidth={3}
                            name="Selling Profit"
                            dot={{ fill: '#4caf50', strokeWidth: 2, r: 5 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="netProfit" 
                            stroke="#2196f3" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Net Profit"
                            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                        />
                    </ComposedChart>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            Loading chart data...
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Alert severity="error">
                        Error loading chart data: {error}
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const stats = getSummaryStats();

    return (
        <Box>
            {/* Summary Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#f44336', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <TrendingDownIcon sx={{ fontSize: 30, mb: 1 }} />
                            <Typography variant="h6" fontWeight="bold">
                                {formatCurrency(stats.totalBuyingCost)}
                            </Typography>
                            <Typography variant="caption">
                                Total Buying Cost
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <TrendingUpIcon sx={{ fontSize: 30, mb: 1 }} />
                            <Typography variant="h6" fontWeight="bold">
                                {formatCurrency(stats.totalSellingProfit)}
                            </Typography>
                            <Typography variant="caption">
                                Total Selling Profit
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: stats.totalNetProfit >= 0 ? '#2196f3' : '#ff9800', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            {stats.totalNetProfit >= 0 ? 
                                <TrendingUpIcon sx={{ fontSize: 30, mb: 1 }} /> : 
                                <TrendingDownIcon sx={{ fontSize: 30, mb: 1 }} />
                            }
                            <Typography variant="h6" fontWeight="bold">
                                {formatCurrency(stats.totalNetProfit)}
                            </Typography>
                            <Typography variant="caption">
                                Net Profit
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#9c27b0', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <TimelineIcon sx={{ fontSize: 30, mb: 1 }} />
                            <Typography variant="h6" fontWeight="bold">
                                {chartData.length}
                            </Typography>
                            <Typography variant="caption">
                                Data Points
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Chart Card */}
            <Card>
                <CardHeader
                    title="📊 Financial Performance Over Time"
                    action={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                                label={`${chartData.length} entries`} 
                                size="small" 
                                color="primary" 
                            />
                            <ToggleButtonGroup
                                value={chartType}
                                exclusive
                                onChange={(_, newType) => newType && setChartType(newType)}
                                size="small"
                            >
                                <ToggleButton value="line">
                                    <LineChartIcon fontSize="small" />
                                </ToggleButton>
                                <ToggleButton value="bar">
                                    <BarChartIcon fontSize="small" />
                                </ToggleButton>
                                <ToggleButton value="area">
                                    <TimelineIcon fontSize="small" />
                                </ToggleButton>
                                <ToggleButton value="composed">
                                    📊
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    }
                />
                <CardContent>
                    {chartData.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                📈 No Data Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Start by adding some buying and selling posts to see your financial performance.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%', height: isMobile ? 300 : 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                {renderChart()}
                            </ResponsiveContainer>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Data Table */}
            {chartData.length > 0 && (
                <Card sx={{ mt: 3 }}>
                    <CardHeader title="📋 Raw Data" />
                    <CardContent>
                        <Box sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                                        <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Buying Cost</th>
                                        <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Selling Profit</th>
                                        <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Net Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartData.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                                                {formatDate(item.date)}
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee', color: '#f44336' }}>
                                                {formatCurrency(item.buyingCost)}
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee', color: '#4caf50' }}>
                                                {formatCurrency(item.sellingProfit)}
                                            </td>
                                            <td style={{ 
                                                padding: '8px', 
                                                textAlign: 'right', 
                                                borderBottom: '1px solid #eee',
                                                color: item.netProfit >= 0 ? '#4caf50' : '#f44336',
                                                fontWeight: 'bold'
                                            }}>
                                                {formatCurrency(item.netProfit)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default UserReportCharts;
