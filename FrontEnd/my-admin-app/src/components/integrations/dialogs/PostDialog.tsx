// src/components/integrations/dialogs/PostDialog.tsx
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
    Stack
} from '@mui/material';
import {
    Close as CloseIcon,
    InsertPhoto as PhotoIcon,
    EmojiEmotions as EmojiIcon,
    AttachFile as AttachIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';

interface PostDialogProps {
    open: boolean;
    onClose: () => void;
    postContent: string;
    setPostContent: (value: string) => void;
    previewUrl: string | null;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PostDialog({
                                       open,
                                       onClose,
                                       postContent,
                                       setPostContent,
                                       previewUrl,
                                       setPreviewUrl,
                                       setSelectedFile,
                                       handleFileSelect
                                   }: PostDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Create New Post
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
                    autoFocus
                    margin="dense"
                    id="post-content"
                    label="What would you like to share?"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    sx={{ mt: 2 }}
                />

                {previewUrl && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain' }}
                        />
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                            onClick={() => {setPreviewUrl(null); setSelectedFile(null);}}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button startIcon={<PhotoIcon />} variant="outlined" component="label" size="small">
                        Photo
                        <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                    </Button>
                    <Button startIcon={<EmojiIcon />} variant="outlined" size="small">
                        Emoji
                    </Button>
                    <Button startIcon={<AttachIcon />} variant="outlined" size="small">
                        Attachment
                    </Button>
                    <Button startIcon={<LocationIcon />} variant="outlined" size="small">
                        Location
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" disabled={!postContent}>Post</Button>
            </DialogActions>
        </Dialog>
    );
}