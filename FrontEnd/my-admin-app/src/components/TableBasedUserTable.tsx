// src/components/TableBasedUserTable.tsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import RestoreIcon from '@mui/icons-material/Restore';
import Typography from '@mui/material/Typography';

// Existing TablePaginationActions component remains the same

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

export default function TableBasedUserTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState<User[]>([]);
    const [deactivatedUsers, setDeactivatedUsers] = React.useState<Set<number>>(new Set());
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [infoDialogOpen, setInfoDialogOpen] = React.useState(false);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editedUser, setEditedUser] = React.useState<User | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [undoAction, setUndoAction] = React.useState<(() => void) | null>(null);

    React.useEffect(() => {
        fetch('https://fakestoreapi.com/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // User actions
    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setInfoDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditedUser({...user});
        setEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editedUser) return;

        // Find and update the user in the array
        const updatedUsers = users.map(user =>
            user.id === editedUser.id ? editedUser : user
        );

        const previousUsers = [...users];
        setUsers(updatedUsers);
        setEditDialogOpen(false);

        // Show success message with undo option
        setSnackbarMessage("User updated successfully");
        setUndoAction(() => () => {
            setUsers(previousUsers);
        });
        setSnackbarOpen(true);
    };

    const handleDeactivateUser = (userId: number) => {
        // Add user ID to deactivated set
        const newDeactivated = new Set(deactivatedUsers);
        newDeactivated.add(userId);

        const previousDeactivated = new Set(deactivatedUsers);
        setDeactivatedUsers(newDeactivated);

        // Show success message with undo option
        setSnackbarMessage("User deactivated successfully");
        setUndoAction(() => () => {
            setDeactivatedUsers(previousDeactivated);
        });
        setSnackbarOpen(true);
    };

    const handleReactivateUser = (userId: number) => {
        // Remove user ID from deactivated set
        const newDeactivated = new Set(deactivatedUsers);
        newDeactivated.delete(userId);

        const previousDeactivated = new Set(deactivatedUsers);
        setDeactivatedUsers(newDeactivated);

        // Show success message with undo option
        setSnackbarMessage("User reactivated successfully");
        setUndoAction(() => () => {
            setDeactivatedUsers(previousDeactivated);
        });
        setSnackbarOpen(true);
    };

    const handleUndoAction = () => {
        if (undoAction) {
            undoAction();
            setSnackbarOpen(false);
            setUndoAction(null);
        }
    };

    const handleEditChange = (field: string, value: string) => {
        if (!editedUser) return;

        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setEditedUser({
                ...editedUser,
                [parent]: {
                    ...editedUser[parent as keyof User] as any,
                    [child]: value
                }
            });
        } else {
            setEditedUser({
                ...editedUser,
                [field]: value
            });
        }
    };

    function TablePaginationActions(props: TablePaginationActionsProps) {
        const theme = useTheme();
        const { count, page, rowsPerPage, onPageChange } = props;

        const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, 0);
        };

        const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, page + 1);
        };

        const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };

        return (
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </Box>
        );
    }

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        height: 8
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 4
                    }
                }}
            >
                <Table sx={{ minWidth: { xs: 650, sm: 800 } }} aria-label="user table">
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: 'primary.main',
                            '& th': {
                                whiteSpace: 'nowrap',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }
                        }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>Phone</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', display: { xs: 'none', lg: 'table-cell' } }}>Address</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                                ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : users
                        ).map((user, index) => {
                            const isDeactivated = deactivatedUsers.has(user.id);
                            return (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        opacity: isDeactivated ? 0.6 : 1,
                                        bgcolor: isDeactivated
                                            ? 'background.default'
                                            : index % 2 === 0 ? 'white' : 'action.hover',
                                        '&:hover': {
                                            bgcolor: 'action.selected',
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 'medium' }}>{user.name.firstname} {user.name.lastname}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{user.email}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.phone}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.address.street}, {user.address.city}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            '& > button': {
                                                minWidth: { xs: '100%', md: '32px' },
                                                transition: 'all 0.2s',
                                                transform: 'translateY(0)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)'
                                                }
                                            }
                                        }}>
                                            <Button
                                                startIcon={<InfoIcon />}
                                                variant="contained"
                                                color="info"
                                                size="small"
                                                onClick={() => handleViewDetails(user)}
                                                sx={{
                                                    boxShadow: 2,
                                                    '&:hover': { boxShadow: 4 }
                                                }}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                startIcon={<EditIcon />}
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleEditUser(user)}
                                                sx={{
                                                    boxShadow: 2,
                                                    '&:hover': { boxShadow: 4 }
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            {isDeactivated ? (
                                                <Button
                                                    startIcon={<RestoreIcon />}
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleReactivateUser(user.id)}
                                                    sx={{
                                                        boxShadow: 2,
                                                        '&:hover': { boxShadow: 4 }
                                                    }}
                                                >
                                                    Activate
                                                </Button>
                                            ) : (
                                                <Button
                                                    startIcon={<BlockIcon />}
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeactivateUser(user.id)}
                                                    sx={{
                                                        boxShadow: 2,
                                                        '&:hover': { boxShadow: 4 }
                                                    }}
                                                >
                                                    Deactivate
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Details Dialog */}
            <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} maxWidth="md">
                <DialogTitle>
                    User Details
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Grid container spacing={2} sx={{ pt: 2 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6">{selectedUser.name.firstname} {selectedUser.name.lastname}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    ID: {selectedUser.id} • Status: {deactivatedUsers.has(selectedUser.id) ? 'Deactivated' : 'Active'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Username</Typography>
                                <Typography variant="body1">{selectedUser.username}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Email</Typography>
                                <Typography variant="body1">{selectedUser.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Phone</Typography>
                                <Typography variant="body1">{selectedUser.phone}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">Address</Typography>
                                <Typography variant="body1">
                                    {selectedUser.address.street}<br />
                                    {selectedUser.address.city}, {selectedUser.address.zipcode}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {editedUser && (
                        <Grid container spacing={2} sx={{ pt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={editedUser.name.firstname}
                                    onChange={(e) => handleEditChange('name.firstname', e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={editedUser.name.lastname}
                                    onChange={(e) => handleEditChange('name.lastname', e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={editedUser.email}
                                    onChange={(e) => handleEditChange('email', e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={editedUser.phone}
                                    onChange={(e) => handleEditChange('phone', e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    value={editedUser.address.street}
                                    onChange={(e) => handleEditChange('address.street', e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={editedUser.address.city}
                                    onChange={(e) => handleEditChange('address.city', e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Zip Code"
                                    value={editedUser.address.zipcode}
                                    onChange={(e) => handleEditChange('address.zipcode', e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications with undo option */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    action={
                        <Button color="inherit" size="small" onClick={handleUndoAction}>
                            UNDO
                        </Button>
                    }
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}