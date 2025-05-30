// src/components/Settings.tsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    SelectChangeEvent
} from '@mui/material';
import {
    Person as PersonIcon,
    Security as SecurityIcon,
    Business as BusinessIcon,
    Article as ArticleIcon,
    VerifiedUser as VerifiedUserIcon,
    NoAccounts as NoAccountsIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Import setting components
import PersonalDetailsSettings from './settings/PersonalDetailsSettings';
import SecuritySettings from './settings/SecuritySettings';
import RoleAndTypeSettings from './settings/RoleAndTypeSettings';
import BusinessRegistrationSettings from './settings/BusinessRegistrationSettings';
import AgreementsSettings from './settings/AgreementsSettings';
import AccountStatusSettings from './settings/AccountStatusSettings';

export default function Settings() {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Form states
    const [personalDetails, setPersonalDetails] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [accountType, setAccountType] = useState('buyer');
    const [role, setRole] = useState('user');
    const [businessRegistration, setBusinessRegistration] = useState({
        brNumber: '',
        companyName: '',
        registrationDate: '',
        isVerified: false
    });

    // Handle form changes
    const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPersonalDetails({
            ...personalDetails,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handleBRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessRegistration({
            ...businessRegistration,
            [e.target.name]: e.target.value
        });
    };

    // Save handlers
    const savePersonalDetails = () => {
        console.log('Saving personal details:', personalDetails);
        // API call to save personal details
        setActiveSection(null);
    };

    const savePassword = () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        console.log('Changing password');
        // API call to change password
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setActiveSection(null);
    };

    const saveRole = () => {
        console.log('Saving role:', role);
        // API call to save role
    };

    const saveAccountType = () => {
        console.log('Saving account type:', accountType);
        // API call to save account type
    };

    const submitBRVerification = () => {
        console.log('Submitting BR for verification:', businessRegistration);
        // API call to submit BR for verification
        setActiveSection(null);
    };

    const handleDeactivateAccount = () => {
        console.log('Deactivating account');
        // API call to deactivate account
        setActiveSection(null);
    };

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
    };

    const handleAccountTypeChange = (newType: string) => {
        setAccountType(newType);
    };

    // Setting category cards
    const settingCategories = [
        {
            id: 'personal',
            title: 'Personal Details',
            description: 'Update your name, email, and contact information',
            icon: <PersonIcon fontSize="large" sx={{ color: '#2196f3' }} />
        },
        {
            id: 'security',
            title: 'Security',
            description: 'Change your password and security settings',
            icon: <SecurityIcon fontSize="large" sx={{ color: '#ff9800' }} />
        },
        {
            id: 'role',
            title: 'Role & Type',
            description: 'Change your account type and access role',
            icon: <VerifiedUserIcon fontSize="large" sx={{ color: '#4caf50' }} />
        },
        {
            id: 'business',
            title: 'Business Registration',
            description: 'Add or verify your seller business registration',
            icon: <BusinessIcon fontSize="large" sx={{ color: '#9c27b0' }} />
        },
        {
            id: 'agreements',
            title: 'Agreements',
            description: 'View media credential agreements and user manual',
            icon: <ArticleIcon fontSize="large" sx={{ color: '#3f51b5' }} />
        },
        {
            id: 'status',
            title: 'Account Status',
            description: 'Deactivate or manage your account status',
            icon: <NoAccountsIcon fontSize="large" sx={{ color: '#f44336' }} />
        }
    ];

    // If a section is active, show its detailed content
    if (activeSection) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => setActiveSection(null)} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1">
                        {settingCategories.find(cat => cat.id === activeSection)?.title}
                    </Typography>
                </Box>

                {/* Load the appropriate component based on active section */}
                {activeSection === 'personal' && (
                    <PersonalDetailsSettings
                        personalDetails={personalDetails}
                        handlePersonalDetailsChange={handlePersonalDetailsChange}
                        savePersonalDetails={savePersonalDetails}
                    />
                )}

                {activeSection === 'security' && (
                    <SecuritySettings
                        passwordForm={passwordForm}
                        handlePasswordChange={handlePasswordChange}
                        savePassword={savePassword}
                    />
                )}

                {activeSection === 'role' && (
                    <RoleAndTypeSettings
                        role={role}
                        accountType={accountType}
                        setRole={handleRoleChange}
                        setAccountType={handleAccountTypeChange}
                        saveRole={saveRole}
                        saveAccountType={saveAccountType}
                    />
                )}

                {activeSection === 'business' && (
                    <BusinessRegistrationSettings
                        businessRegistration={businessRegistration}
                        handleBRChange={handleBRChange}
                        submitBRVerification={submitBRVerification}
                    />
                )}

                {activeSection === 'agreements' && (
                    <AgreementsSettings />
                )}

                {activeSection === 'status' && (
                    <AccountStatusSettings
                        handleDeactivateAccount={handleDeactivateAccount}
                    />
                )}
            </Container>
        );
    }

    // Main settings menu with cards
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Account Settings
            </Typography>

            <Grid container spacing={3}>
                {settingCategories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                                }
                            }}
                            onClick={() => setActiveSection(category.id)}
                        >
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                                <Box sx={{ mb: 2 }}>
                                    {category.icon}
                                </Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {category.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {category.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}