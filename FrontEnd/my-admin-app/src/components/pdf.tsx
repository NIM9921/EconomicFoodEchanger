import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Tabs, Tab, Chip,
    Card, CardContent, TextField, InputAdornment,
    Accordion, AccordionSummary, AccordionDetails,
    FormControl, InputLabel, Select, MenuItem,
    SelectChangeEvent, List, ListItem, ListItemText,
    ListItemIcon, IconButton, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ApiConfig from '../utils/ApiConfig';

// Define interface for CSV item
interface CSVItem {
    [key: string]: string;
}

// Define interface for special note
interface SpecialNote {
    category: string;
    note: string;
}

// Define a structure for our market data JSON
interface MarketDataJSON {
    metadata: {
        fileName: string;
        dateProcessed: string;
    };
    specialNotes: SpecialNote[];
    headers: string[];
    items: CSVItem[];
}

// Interface for backend CSV records
interface CsvRecord {
    id: number;
    file_name?: string;
    upload_date: string;
    report: string; // This contains the JSON data as string
}

// Define props for TabPanel
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// Custom styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Create initial empty market data
const createEmptyMarketData = (): MarketDataJSON => ({
    metadata: {
        fileName: '',
        dateProcessed: '',
    },
    specialNotes: [],
    headers: [],
    items: []
});

// Add interface for backend CSV entity
interface CsvEntity {
    id?: number;
    file_name: string;
    report: string;
    upload_date?: string;
}

function Csv() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [marketData, setMarketData] = useState<MarketDataJSON>(createEmptyMarketData());
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [csvRecords, setCsvRecords] = useState<CsvRecord[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<CsvRecord | null>(null);
    const [mainTabValue, setMainTabValue] = useState(1); // Start with View Latest CSV tab
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch existing CSV records from backend
    const fetchCsvRecords = async () => {
        setIsLoadingRecords(true);
        setError(null);
        
        try {
            console.log('Fetching CSV records from backend...');
            const response = await fetch(`${ApiConfig.Domain}/csvfileHandeling`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Check if response is JSON or binary data
            const contentType = response.headers.get('content-type');
            console.log('Response content type:', contentType);
            
            if (contentType && contentType.includes('application/json')) {
                // If it's JSON, parse directly
                const data = await response.json();
                console.log('Fetched JSON data:', data);
                
                // Create a mock record from the JSON data
                const mockRecord: CsvRecord = {
                    id: 1,
                    file_name: data.metadata?.fileName || 'Latest CSV File',
                    upload_date: data.metadata?.dateProcessed || new Date().toISOString(),
                    report: JSON.stringify(data)
                };
                
                setCsvRecords([mockRecord]);
                
                // Auto-load the data when records are fetched
                handleAutoLoadData(mockRecord);
                
            } else {
                // If it's binary data, convert to string first
                const arrayBuffer = await response.arrayBuffer();
                const decoder = new TextDecoder();
                const jsonString = decoder.decode(arrayBuffer);
                
                console.log('Decoded string:', jsonString);
                
                try {
                    const data = JSON.parse(jsonString);
                    console.log('Parsed data:', data);
                    
                    // Create a mock record from the parsed data
                    const mockRecord: CsvRecord = {
                        id: 1,
                        file_name: data.metadata?.fileName || 'Latest CSV File',
                        upload_date: data.metadata?.dateProcessed || new Date().toISOString(),
                        report: jsonString
                    };
                    
                    setCsvRecords([mockRecord]);
                    
                    // Auto-load the data when records are fetched
                    handleAutoLoadData(mockRecord);
                    
                } catch (parseError) {
                    console.error('Failed to parse JSON from binary data:', parseError);
                    setError('Failed to parse CSV data from server.');
                    setCsvRecords([]);
                }
            }
        } catch (err) {
            console.error('Error fetching CSV records:', err);
            setError('Failed to fetch CSV records. Please try again.');
            setCsvRecords([]);
            // If no data available, switch to upload tab
            setMainTabValue(0);
        } finally {
            setIsLoadingRecords(false);
        }
    };

    // Auto-load data when records are available
    const handleAutoLoadData = (record: CsvRecord) => {
        try {
            console.log('Auto-loading CSV record:', record);
            
            // Parse the report data
            let reportData: MarketDataJSON;
            
            if (typeof record.report === 'string') {
                reportData = JSON.parse(record.report);
            } else if (Array.isArray(record.report)) {
                const jsonString = new TextDecoder().decode(new Uint8Array(record.report));
                reportData = JSON.parse(jsonString);
            } else {
                throw new Error('Invalid report format');
            }
            
            console.log('Auto-loaded CSV data with', reportData.items?.length || 0, 'items');
            
            // Update the display data
            setMarketData(reportData);
            setSelectedRecord(record);
            setTabValue(0); // Reset category tab
            setSearchTerm(''); // Clear search
            
        } catch (err) {
            console.error('Error auto-loading CSV record:', err);
            setError(`Failed to load CSV data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    // Load CSV records and auto-display on component mount
    useEffect(() => {
        fetchCsvRecords();
    }, []);

    // Parse and display selected CSV record
    const handleViewRecord = (record: CsvRecord) => {
        try {
            console.log('Manually viewing record:', record);
            
            // Parse the report data
            let reportData: MarketDataJSON;
            
            if (typeof record.report === 'string') {
                reportData = JSON.parse(record.report);
            } else if (Array.isArray(record.report)) {
                const jsonString = new TextDecoder().decode(new Uint8Array(record.report));
                reportData = JSON.parse(jsonString);
            } else {
                throw new Error('Invalid report format');
            }
            
            console.log('Parsed report data:', reportData);
            
            // Validate the structure
            if (!reportData.items || !Array.isArray(reportData.items)) {
                throw new Error('Invalid data structure: items array not found');
            }
            
            if (!reportData.headers || !Array.isArray(reportData.headers)) {
                throw new Error('Invalid data structure: headers array not found');
            }
            
            // Update the display data
            setMarketData(reportData);
            setSelectedRecord(record);
            setTabValue(0); // Reset category tab
            setSearchTerm(''); // Clear search
            
            console.log('Successfully loaded CSV record with', reportData.items.length, 'items');
        } catch (err) {
            console.error('Error parsing CSV record:', err);
            setError(`Failed to load CSV data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    // Delete CSV record
    const handleDeleteRecord = async (recordId: number) => {
        if (!window.confirm('Are you sure you want to delete this CSV record?')) {
            return;
        }
        
        try {
            const response = await fetch(`${ApiConfig.Domain}/csvfileHandeling/${recordId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete record: ${response.status}`);
            }
            
            // Refresh the records list
            await fetchCsvRecords();
            
            // If the deleted record was selected, clear the display
            if (selectedRecord?.id === recordId) {
                setMarketData(createEmptyMarketData());
                setSelectedRecord(null);
            }
            
        } catch (err) {
            console.error('Error deleting record:', err);
            setError('Failed to delete record. Please try again.');
        }
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Get unique categories from items
    const categories = React.useMemo(() => {
        if (!marketData.items.length) return [];
        return Array.from(new Set(marketData.items.map(item =>
            item.category ? item.category.toUpperCase() : 'UNCATEGORIZED'
        )));
    }, [marketData.items]);

    // Filter items based on search term and active tab (category)
    const filteredItems = React.useMemo(() => {
        if (!marketData.items.length) return [];

        let filtered = marketData.items;

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                Object.values(item).some(value =>
                    value && value.toString().toLowerCase().includes(searchLower)
                )
            );
        }

        // Apply category filter (if not on "All" tab)
        if (tabValue > 0 && categories.length > 0) {
            const selectedCategory = categories[tabValue - 1];
            filtered = filtered.filter(item =>
                (item.category ? item.category.toUpperCase() : 'UNCATEGORIZED') === selectedCategory
            );
        }

        return filtered;
    }, [marketData.items, searchTerm, tabValue, categories]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setMainTabValue(newValue);
        if (newValue === 1) {
            // Refresh records when switching to view tab
            fetchCsvRecords();
        }
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setUploadSuccess(null);
        setMarketData(createEmptyMarketData());
        setTabValue(0);
        setSearchTerm('');

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const rows = results.data as string[][];

                    // Begin creating our JSON structure
                    const newMarketData: MarketDataJSON = {
                        metadata: {
                            fileName: file.name,
                            dateProcessed: new Date().toISOString(),
                        },
                        specialNotes: [],
                        headers: [],
                        items: []
                    };

                    // Extract special notes
                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];

                        // Check if this is a special note row
                        if (row[0] === "Vegetables" || row[0] === "Fish" || row[0] === "Others") {
                            newMarketData.specialNotes.push({
                                category: row[0],
                                note: row[1] || ''
                            });
                        }

                        // Find the data table header row
                        if (row.includes("Item-name")) {
                            // Get headers
                            const headerRow = rows[i];
                            const cleanHeaders = headerRow.filter(h => h !== '');
                            newMarketData.headers = cleanHeaders;

                            // Get data rows (after the header row)
                            const dataRows = rows.slice(i + 1);

                            // Convert to objects
                            for (const dataRow of dataRows) {
                                if (dataRow.length <= 1 || dataRow.every(cell => !cell)) continue; // Skip empty rows

                                const item: CSVItem = {};
                                headerRow.forEach((header, idx) => {
                                    if (header && idx < dataRow.length) {
                                        item[header] = dataRow[idx] || '';
                                    }
                                });

                                // Only add if it has an Item-name
                                if (item['Item-name'] && item['Item-name'].trim() !== '') {
                                    newMarketData.items.push(item);
                                }
                            }
                            break;
                        }
                    }

                    // Store the created JSON in state
                    setMarketData(newMarketData);

                    // Send to backend
                    await uploadToBackend(newMarketData, file.name);

                    console.log("Generated market data JSON:", newMarketData);

                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                    console.error('Error processing CSV:', err);
                    setError(`Error processing CSV: ${errorMessage}`);
                } finally {
                    setIsLoading(false);
                }
            },
            error: (parseError) => {
                console.error('CSV parsing error:', parseError);
                setError(`CSV parsing error: ${parseError.message}`);
                setIsLoading(false);
            }
        });
    };

    // Alternative: Convert JSON to byte array directly
    const uploadToBackend = async (marketData: MarketDataJSON, fileName: string) => {
        try {
            setIsUploading(true);
            
            // Convert JSON to byte array
            const jsonString = JSON.stringify(marketData);
            const encoder = new TextEncoder();
            const byteArray = encoder.encode(jsonString);
            
            // Convert byte array to array of numbers for JSON serialization
            const reportBytes = Array.from(byteArray);
            
            // Prepare the CSV entity for backend - remove file_name
            const csvEntity = {
                report: reportBytes // Only send report, no file_name
            };

            console.log('Sending to backend:', {
                reportSize: reportBytes.length
            });

            const response = await fetch(`${ApiConfig.Domain}/csvfileHandeling/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(csvEntity)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to upload CSV: ${response.status} - ${errorText}`);
            }

            const result = await response.arrayBuffer();
            
            setUploadSuccess(`CSV "${fileName}" uploaded successfully to database!`);
            setTimeout(() => setUploadSuccess(null), 5000);

        } catch (err) {
            console.error('Backend upload failed:', err);
            setError(`Failed to save to database: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const resetFile = () => {
        setMarketData(createEmptyMarketData());
        setError(null);
        setUploadSuccess(null);
        setTabValue(0);
        setSearchTerm('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            {/* Main Tabs */}
            <Paper elevation={2} sx={{ mb: 3 }}>
                <Tabs
                    value={mainTabValue}
                    onChange={handleMainTabChange}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            py: 2
                        }
                    }}
                >
                    <Tab 
                        icon={<UploadFileIcon />} 
                        label="Upload New CSV" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<DescriptionIcon />} 
                        label={`📊 Latest Price Data ${csvRecords.length > 0 ? '✓' : ''}`} 
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Upload Tab */}
            {mainTabValue === 0 && (
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                            Upload Daily Price Data
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                component="label"
                                variant="contained"
                                color="success"
                                startIcon={<UploadFileIcon />}
                                disabled={isLoading || isUploading}
                            >
                                {isUploading ? 'Saving...' : 'Upload CSV'}
                                <VisuallyHiddenInput
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleUpload}
                                    disabled={isLoading || isUploading}
                                />
                            </Button>
                            {marketData.metadata.fileName && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<ClearIcon />}
                                    onClick={resetFile}
                                    disabled={isLoading || isUploading}
                                >
                                    Clear
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {marketData.metadata.fileName && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip
                                label={marketData.metadata.fileName}
                                variant="outlined"
                                color="success"
                            />
                            {uploadSuccess && (
                                <Chip
                                    label="✓ Saved to Database"
                                    color="success"
                                    size="small"
                                />
                            )}
                        </Box>
                    )}

                    {(isLoading || isUploading) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                            <CircularProgress color="success" sx={{ mr: 2 }} />
                            <Typography variant="body2">
                                {isLoading ? 'Processing CSV...' : 'Saving to database...'}
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                    )}

                    {uploadSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>{uploadSuccess}</Alert>
                    )}
                </Paper>
            )}

            {/* View Latest CSV Tab */}
            {mainTabValue === 1 && (
                <Box>
                    {/* Header Section */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                📊 Daily Market Price Data
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<RefreshIcon />}
                                onClick={fetchCsvRecords}
                                disabled={isLoadingRecords}
                                sx={{ 
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                Refresh Data
                            </Button>
                        </Box>

                        {/* Auto-loading status */}
                        {isLoadingRecords && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                                <CircularProgress size={24} color="info" />
                                <Typography variant="body1" color="info.main">
                                    Loading latest market data...
                                </Typography>
                            </Box>
                        )}

                        {csvRecords.length > 0 && selectedRecord && !isLoadingRecords && (
                            <Box sx={{ 
                                mt: 2, 
                                p: 2, 
                                bgcolor: 'success.50', 
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'success.200'
                            }}>
                                <Typography variant="h6" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    ✅ Latest Data Loaded
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    File: {selectedRecord.file_name} • Processed: {formatDate(selectedRecord.upload_date)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    📦 {marketData.items.length} items • 📋 {marketData.headers.length} columns • 📝 {marketData.specialNotes.length} special notes
                                </Typography>
                            </Box>
                        )}

                        {error && !isLoadingRecords && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {!isLoadingRecords && csvRecords.length === 0 && !error && (
                            <Box sx={{ 
                                textAlign: 'center', 
                                py: 4,
                                mt: 2,
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                bgcolor: 'grey.50'
                            }}>
                                <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No CSV data available
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    Upload your first CSV file to view market price data here!
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setMainTabValue(0)}
                                    startIcon={<UploadFileIcon />}
                                    sx={{ 
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 4
                                    }}
                                >
                                    Go to Upload
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    {/* Available CSV Records */}
                    {!isLoadingRecords && csvRecords.length > 0 && (
                        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                📁 Available CSV Files
                            </Typography>
                            
                            {csvRecords.map((record, index) => (
                                <Card key={record.id} sx={{ 
                                    mb: 2,
                                    border: selectedRecord?.id === record.id ? '2px solid' : '1px solid',
                                    borderColor: selectedRecord?.id === record.id ? 'primary.main' : 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        boxShadow: 2
                                    }
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <DescriptionIcon color="primary" sx={{ fontSize: 32 }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight="medium">
                                                        {record.file_name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        📅 Processed: {formatDate(record.upload_date)}
                                                    </Typography>
                                                    {selectedRecord?.id === record.id && (
                                                        <Chip 
                                                            label="✅ Currently Loaded" 
                                                            size="small" 
                                                            color="success" 
                                                            sx={{ mt: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                            <Button
                                                variant={selectedRecord?.id === record.id ? "outlined" : "contained"}
                                                onClick={() => handleViewRecord(record)}
                                                startIcon={<VisibilityIcon />}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                {selectedRecord?.id === record.id ? 'Reload' : 'Load Data'}
                                            </Button>
                                        </Box>
                                        
                                        {/* Show preview of data structure */}
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                📋 Data Overview:
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                {(() => {
                                                    try {
                                                        const data = JSON.parse(record.report);
                                                        return (
                                                            <>
                                                                <Chip 
                                                                    label={`📦 ${data.items?.length || 0} items`} 
                                                                    size="small" 
                                                                    variant="outlined"
                                                                    color="primary"
                                                                />
                                                                <Chip 
                                                                    label={`📋 ${data.headers?.length || 0} columns`} 
                                                                    size="small" 
                                                                    variant="outlined"
                                                                    color="info"
                                                                />
                                                                <Chip 
                                                                    label={`📝 ${data.specialNotes?.length || 0} notes`} 
                                                                    size="small" 
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                />
                                                            </>
                                                        );
                                                    } catch {
                                                        return (
                                                            <Chip 
                                                                label="❌ Data format error" 
                                                                size="small" 
                                                                color="error" 
                                                                variant="outlined" 
                                                            />
                                                        );
                                                    }
                                                })()}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Paper>
                    )}
                </Box>
            )}

            {/* Data Display Section - Show when data is available */}
            {marketData.items.length > 0 && (
                <>
                    {/* Special Notes */}
                    {marketData.specialNotes.length > 0 && (
                        <Accordion defaultExpanded sx={{ mb: 3 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="special-notes-content"
                                id="special-notes-header"
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon color="info" sx={{ mr: 1 }} />
                                    <Typography variant="h6">📝 Market Updates & Special Notes</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {marketData.specialNotes.map((note, index) => (
                                    <Card key={index} variant="outlined" sx={{ mb: 1, bgcolor: '#f8f8f8' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                                {note.category}
                                            </Typography>
                                            <Typography variant="body2">
                                                {note.note}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {/* Price Data Table */}
                    <Paper elevation={3} sx={{ mb: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CategoryIcon color="success" sx={{ mr: 1 }} />
                                        <Typography variant="h6">
                                            💰 Market Price Data ({filteredItems.length} items)
                                        </Typography>
                                    </Box>
                                    <TextField
                                        placeholder="🔍 Search items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchTerm ? (
                                                <InputAdornment position="end">
                                                    <ClearIcon
                                                        fontSize="small"
                                                        sx={{ cursor: 'pointer' }}
                                                        onClick={() => setSearchTerm('')}
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        sx={{ width: 300 }}
                                    />
                                </Box>

                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleTabChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        textColor="primary"
                                        indicatorColor="primary"
                                    >
                                        <Tab label="🛒 All Items" />
                                        {categories.map((category, index) => (
                                            <Tab key={index} label={`📦 ${category}`} />
                                        ))}
                                    </Tabs>
                                </Box>

                                <TabPanel value={tabValue} index={tabValue}>
                                    <TableContainer component={Paper} sx={{ maxHeight: 500, borderRadius: 2 }}>
                                        <Table stickyHeader aria-label="price data table" size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {marketData.headers.map((header, idx) => (
                                                        header && (
                                                            <StyledTableCell key={idx}>
                                                                {header.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </StyledTableCell>
                                                        )
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredItems.map((item, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{ 
                                                            '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                                                            '&:hover': { backgroundColor: '#e8f5e8' }
                                                        }}
                                                    >
                                                        {marketData.headers.map((header, idx) => (
                                                            header && (
                                                                <TableCell key={`${index}-${idx}`}>
                                                                    {header.toLowerCase().includes('price') || header.toLowerCase().includes('rs') ? 
                                                                        `Rs. ${item[header]}` : item[header]
                                                                    }
                                                                </TableCell>
                                                            )
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {filteredItems.length === 0 && (
                                        <Box sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                🔍 No items match your search
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Try searching with different keywords
                                            </Typography>
                                        </Box>
                                    )}
                                </TabPanel>
                            </CardContent>
                        </Card>
                    </Paper>
                </>
            )}

            {/* Empty state when no data and not loading for upload tab */}
            {!isLoading && marketData.items.length === 0 && !error && mainTabValue === 0 && (
                <Paper
                    elevation={1}
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        backgroundColor: '#f9f9f9',
                        border: '1px dashed #ccc',
                        borderRadius: '4px'
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        Upload a CSV file to view price data
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        The file should contain item prices with proper headers
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

export default Csv;