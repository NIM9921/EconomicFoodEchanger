import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Tabs, Tab, Chip,
    Card, CardContent, TextField, InputAdornment,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

function Csv() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [marketData, setMarketData] = useState<MarketDataJSON>(createEmptyMarketData());
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setMarketData(createEmptyMarketData());
        setTabValue(0);
        setSearchTerm('');

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
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

                    // Optional: Log the JSON to console
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

    const resetFile = () => {
        setMarketData(createEmptyMarketData());
        setError(null);
        setTabValue(0);
        setSearchTerm('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                        Daily Price Data
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            component="label"
                            variant="contained"
                            color="success"
                            startIcon={<UploadFileIcon />}
                        >
                            Upload CSV
                            <VisuallyHiddenInput
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleUpload}
                                disabled={isLoading}
                            />
                        </Button>
                        {marketData.metadata.fileName && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<ClearIcon />}
                                onClick={resetFile}
                            >
                                Clear
                            </Button>
                        )}
                    </Box>
                </Box>

                {marketData.metadata.fileName && (
                    <Chip
                        label={marketData.metadata.fileName}
                        variant="outlined"
                        color="success"
                        sx={{ mb: 2 }}
                    />
                )}

                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress color="success" />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}
            </Paper>

            {marketData.specialNotes.length > 0 && (
                <Accordion defaultExpanded sx={{ mb: 3 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="special-notes-content"
                        id="special-notes-header"
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon color="info" sx={{ mr: 1 }} />
                            <Typography variant="h6">Special Notes</Typography>
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

            {marketData.items.length > 0 && (
                <Paper elevation={3} sx={{ mb: 3 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CategoryIcon color="success" sx={{ mr: 1 }} />
                                    <Typography variant="h6">
                                        Price Data ({filteredItems.length} items)
                                    </Typography>
                                </Box>
                                <TextField
                                    placeholder="Search items..."
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
                                    sx={{ width: 250 }}
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
                                    <Tab label="All Items" />
                                    {categories.map((category, index) => (
                                        <Tab key={index} label={category} />
                                    ))}
                                </Tabs>
                            </Box>

                            <TabPanel value={tabValue} index={tabValue}>
                                <TableContainer component={Paper} sx={{ maxHeight: 450 }}>
                                    <Table stickyHeader aria-label="price data table" size="small">
                                        <TableHead>
                                            <TableRow>
                                                {marketData.headers.map((header, idx) => (
                                                    header && (
                                                        <StyledTableCell key={idx}>
                                                            {header.replace(/-/g, ' ')}
                                                        </StyledTableCell>
                                                    )
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredItems.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                                >
                                                    {marketData.headers.map((header, idx) => (
                                                        header && (
                                                            <TableCell key={`${index}-${idx}`}>
                                                                {item[header]}
                                                            </TableCell>
                                                        )
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {filteredItems.length === 0 && (
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No items match your search
                                        </Typography>
                                    </Box>
                                )}
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Paper>
            )}

            {!isLoading && marketData.items.length === 0 && !error && (
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