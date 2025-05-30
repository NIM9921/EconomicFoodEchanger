// src/components/integrations/dialogs/StoryDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import {
    Close as CloseIcon,
    InsertPhoto as PhotoIcon,
    Add as AddIcon
} from '@mui/icons-material';

interface StoryDialogProps {
    open: boolean;
    onClose: () => void;
    storyTitle: string;
    setStoryTitle: (value: string) => void;
    previewUrl: string | null;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StoryDialog({
                                        open,
                                        onClose,
                                        storyTitle,
                                        setStoryTitle,
                                        previewUrl,
                                        setPreviewUrl,
                                        selectedFile,
                                        setSelectedFile,
                                        handleFileSelect
                                    }: StoryDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Create New Story
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="story-title"
                    label="Story Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {previewUrl ? (
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <img
                            src={previewUrl}
                            alt="Story Preview"
                            style={{ width: '100%', borderRadius: '8px', height: '200px', objectFit: 'cover' }}
                        />
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                            onClick={() => {setPreviewUrl(null); setSelectedFile(null);}}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            height: '200px',
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            mb: 2
                        }}
                    >
                        <PhotoIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<AddIcon />}
                        >
                            Upload Media
                            <input
                                type="file"
                                hidden
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />
                        </Button>
                    </Box>
                )}

                <Typography variant="caption" color="text.secondary">
                    Stories will be visible for 24 hours after posting
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={!storyTitle || !selectedFile}
                >
                    Create Story
                </Button>
            </DialogActions>
        </Dialog>
    );
}