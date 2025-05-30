// src/components/Integrations.tsx
import React, { useState } from 'react';
import { Container } from '@mui/material';
import IntegrationsHeader from './integrations/IntegrationsHeader';
import ContentCreationSection from './integrations/ContentCreationSection';
import AdminToolsSection from './integrations/AdminToolsSection';
import PostDialog from './integrations/dialogs/PostDialog';
import StoryDialog from './integrations/dialogs/StoryDialog';
import ConnectDialog from './integrations/dialogs/ConnectDialog';
import UserManagementDialog from './integrations/dialogs/UserManagementDialog';
import { AdminFeature } from './integrations/types';

export default function Integrations() {
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const [openFeatureDialog, setOpenFeatureDialog] = useState<string | null>(null);
    const [postContent, setPostContent] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Administration features data
    const adminFeatures: AdminFeature[] = [
        { id: 'user', name: 'User Management', icon: 'admin', description: 'Manage users, permissions and roles' },
        { id: 'analytics', name: 'Analytics Dashboard', icon: 'analytics', description: 'View performance metrics and sales data' },
        { id: 'content', name: 'Content Moderation', icon: 'editnote', description: 'Review and approve user submitted content' }
    ];

    const handleOpenDialog = (dialogId: string) => {
        setOpenDialog(dialogId);
    };

    const handleCloseDialog = () => {
        setOpenDialog(null);
        setPostContent('');
        setStoryTitle('');
        setPreviewUrl(null);
        setSelectedFile(null);
    };

    const handleFeatureClick = (featureId: string) => {
        setOpenFeatureDialog(featureId);
    };

    const handleCloseFeatureDialog = () => {
        setOpenFeatureDialog(null);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <IntegrationsHeader />

            <ContentCreationSection onOpenDialog={handleOpenDialog} />

            <AdminToolsSection
                features={adminFeatures}
                onFeatureClick={handleFeatureClick}
            />

            <PostDialog
                open={openDialog === 'post'}
                onClose={handleCloseDialog}
                postContent={postContent}
                setPostContent={setPostContent}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                setSelectedFile={setSelectedFile}
                handleFileSelect={handleFileSelect}
            />

            <StoryDialog
                open={openDialog === 'story'}
                onClose={handleCloseDialog}
                storyTitle={storyTitle}
                setStoryTitle={setStoryTitle}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                handleFileSelect={handleFileSelect}
            />

            <ConnectDialog
                open={openDialog === 'connect'}
                onClose={handleCloseDialog}
            />

            <UserManagementDialog
                open={openFeatureDialog === 'user'}
                onClose={handleCloseFeatureDialog}
            />
        </Container>
    );
}