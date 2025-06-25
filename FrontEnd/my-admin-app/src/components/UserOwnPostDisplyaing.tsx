import { useState, useEffect } from 'react';
import VegitableStoryCard from "./CardComponent";
import VegitablePost, { SharedPostData } from "./VegitablePost";
import { Box, Typography, Skeleton, Tabs, Tab, Alert, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ShareStoryForm from './sharestory/ShareStoryForm.tsx';
import ApiConfig from '../utils/ApiConfig';

// Interface for the API response data
interface StoryData {
    id: number;
    title: string;
    discription: string;
    image: string | null;
    createdateandtime: string | null;
    username: {
        id: number;
        name: string;
        city: string;
        address: string;
        status: boolean;
        nic: string;
        mobileNumber: number;
        username: string;
        password: string;
        roleList: Array<{
            id: number;
            name: string;
        }>;
    } | null;
}

// Interface for current user data
interface CurrentUser {
    id: number;
    name: string;
    username: string;
    profileImage: string | null;
    city: string;
}

// Transform API data to match card component props
interface CardDetails {
    title: string;
    content: string;
    user: string;
    photo: string;
}

// Facebook-style Add Story Card Component
const AddStoryCard = ({ currentUser, onClick }: { currentUser: CurrentUser | null, onClick: () => void }) => {
    const [imageError, setImageError] = useState(false);

    const getUserProfileImage = () => {
        if (!currentUser?.profileImage || imageError) {
            return null;
        }

        if (currentUser.profileImage.startsWith('data:image')) {
            return currentUser.profileImage;
        }

        return `data:image/jpeg;base64,${currentUser.profileImage}`;
    };

    const profileImageSrc = getUserProfileImage();

    if (!currentUser) {
        return (
            <Box sx={{
                width: 250,
                minWidth: 250,
                margin: '8px',
                height: 400,
                borderRadius: 1,
                border: '1px solid #c8e6c9',
            }}>
                <Skeleton variant="rectangular" width="100%" height="240" />
                <Box sx={{ p: 2 }}>
                    <Skeleton width="80%" height={20} />
                    <Skeleton width="60%" height={15} sx={{ mt: 0.5 }} />
                </Box>
            </Box>
        );
    }

    return (
        <Box
            onClick={onClick}
            sx={{
                width: 250,
                minWidth: 250,
                margin: '8px',
                height: 400,
                boxShadow: 2,
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid #c8e6c9',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(46, 125, 50, 0.25)',
                    borderColor: '#4caf50'
                }
            }}
        >
            {/* Background Image Section */}
            <Box sx={{
                height: 240,
                background: profileImageSrc
                    ? `linear-gradient(rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.3)), url(${profileImageSrc})`
                    : 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {!profileImageSrc && (
                    <PersonIcon sx={{ fontSize: 60, color: 'white', opacity: 0.8 }} />
                )}

                {/* Add Button */}
                <Box sx={{
                    position: 'absolute',
                    bottom: -25,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#2e7d32',
                    border: '4px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateX(-50%) scale(1.1)',
                        backgroundColor: '#1b5e20'
                    }
                }}>
                    <AddIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{
                height: 'calc(400px - 240px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'rgba(240, 247, 235, 0.4)',
                pt: 4,
                px: 2
            }}>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                        color: '#2e7d32',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}
                >
                    Add to story
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#558b2f',
                        textAlign: 'center'
                    }}
                >
                    Share your farming experience with the community
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        mt: 1,
                        color: '#2e7d32',
                        fontWeight: 'medium'
                    }}
                >
                    Create by: {currentUser?.name || 'You'}
                </Typography>
            </Box>
        </Box>
    );
};

export default function UserOwnPostDisplaying() {
    const [cardsDetails, setCardsDetails] = useState<CardDetails[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0); // Start with Community Posts tab

    // State for shared posts
    const [sharedPosts, setSharedPosts] = useState<SharedPostData[]>([]);
    const [postsLoading, setPostsLoading] = useState<boolean>(false);
    const [postsError, setPostsError] = useState<string | null>(null);

    // Function to convert base64 string to proper data URL for image display
    const convertImageToDataUrl = (imageData: string | null): string => {
        const defaultImage = "https://fastly.picsum.photos/id/75/1999/2998.jpg?hmac=0agRZd8c5CRiFvADOWJqfTv6lqYBty3Kw-9LEtLp_98";

        if (!imageData) {
            return defaultImage;
        }

        if (imageData.startsWith('data:image')) {
            return imageData;
        }

        return `data:image/jpeg;base64,${imageData}`;
    };

    // Function to safely get user name from username object
    const getUserName = (username: StoryData['username']): string => {
        if (!username || !username.name) {
            return "Unknown User";
        }
        return username.name;
    };

    // Function to fetch current user data
    const fetchCurrentUser = async () => {
        try {
            setUserLoading(true);
            const mockUser: CurrentUser = {
                id: 1,
                name: "",
                username: "create farmer",
                profileImage: null,
                city: "Colombo"
            };

            setCurrentUser(mockUser);
        } catch (err) {
            console.error('Error fetching current user:', err);
            setCurrentUser(null);
        } finally {
            setUserLoading(false);
        }
    };

    // Function to fetch shared posts from API
    const fetchSharedPosts = async () => {
        try {
            setPostsLoading(true);
            setPostsError(null);
            console.log('Fetching shared posts...');

            const response = await fetch(ApiConfig.Domain + '/sharedpost/getposybyuserid');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SharedPostData[] = await response.json();
            console.log('Fetched shared posts data:', data);
            
            // Enhanced Debug: Check coordinates and bitDetails in the data
            data.forEach((post, index) => {
                console.log(`Post ${index + 1} complete data:`, {
                    id: post.id,
                    title: post.title,
                    coordinates: {
                        postLatitude: post.latitude,
                        postLongitude: post.longitude,
                        postLatType: typeof post.latitude,
                        postLngType: typeof post.longitude,
                    },
                    user: {
                        userLatitude: post.username?.latitude,
                        userLongitude: post.username?.longitude,
                        userAddress: post.username?.address,
                        userCity: post.username?.city,
                    },
                    bitDetails: {
                        count: post.bitDetails?.length || 0,
                        details: post.bitDetails?.map(bid => ({
                            id: bid.id,
                            bidder: bid.user?.name,
                            amount: bid.bitrate,
                            quantity: bid.needamount,
                            contact: bid.bitdetailscol,
                            location: bid.deliverylocation,
                            confirmed: bid.conformedstate
                        })) || []
                    },
                    reviews: {
                        count: post.reviews?.length || 0
                    }
                });

                // Convert and log the coordinates
                if (post.latitude && post.longitude) {
                    const lat = parseFloat(post.latitude);
                    const lng = parseFloat(post.longitude);
                    console.log(`Post ${index + 1} converted coordinates:`, { lat, lng });
                }
            });

            setSharedPosts(data || []);
        } catch (err) {
            console.error('Error fetching shared posts:', err);
            setPostsError(err instanceof Error ? err.message : 'Failed to fetch shared posts');
            setSharedPosts([]);
        } finally {
            setPostsLoading(false);
        }
    };

    const handleAddStoryClick = () => {
        console.log("Add story clicked for user:", currentUser?.name);
        setShareDialogOpen(true);
    };

    const handleStoryUploadSuccess = () => {
        fetchStoryData();
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
        // Fetch shared posts when switching to community posts tab
        if (newValue === 0 && sharedPosts.length === 0) {
            fetchSharedPosts();
        }
    };

    // Function to fetch story data from API
    const fetchStoryData = async () => {
        try {
            setLoading(true);
            const response = await fetch(ApiConfig.Domain + '/sharestory/all');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: StoryData[] = await response.json();

            const transformedData: CardDetails[] = data
                .filter(story => story && story.title && story.discription)
                .map((story) => ({
                    title: story.title || "Untitled",
                    content: story.discription || "No description available",
                    user: getUserName(story.username),
                    photo: convertImageToDataUrl(story.image)
                }));

            setCardsDetails(transformedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching story data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch story data');
            setCardsDetails([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchStoryData();
        // Load community posts by default
        fetchSharedPosts();
    }, []);

    // Function to refresh shared posts data
    const refreshSharedPosts = async () => {
        console.log('Refreshing shared posts data...');
        await fetchSharedPosts();
    };

    // Loading skeleton for posts
    const PostSkeleton = () => (
        <Box sx={{ mb: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2, mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2, mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        </Box>
    );

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '100%',
            mx: 'auto',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Stories section */}
            <Box sx={{ 
                mb: 4,
                backgroundColor: 'white',
                borderRadius: { xs: 0, sm: 2 },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                p: { xs: 2, sm: 3 }
            }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    🌟 Latest Stories & Updates
                </Typography>

                {/* Stories list with Add Story card first */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: { xs: "12px", sm: "16px" },
                        width: "100%",
                        maxWidth: "100%",
                        overflowX: "auto",
                        pb: 2,
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "thin",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                            height: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "rgba(0, 0, 0, 0.05)",
                            borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#bdbdbd",
                            borderRadius: "4px",
                            '&:hover': {
                                backgroundColor: "#999"
                            }
                        },
                    }}
                >
                    {/* Add Story Card */}
                    <Box sx={{
                        minWidth: { xs: '160px', sm: '200px', md: '220px' },
                        flexShrink: 0
                    }}>
                        <AddStoryCard
                            currentUser={currentUser}
                            onClick={handleAddStoryClick}
                        />
                    </Box>

                    {/* Loading indicator for stories */}
                    {loading && (
                        <>
                            {[1, 2, 3, 4].map((index) => (
                                <Box key={index} sx={{
                                    minWidth: { xs: '160px', sm: '200px', md: '220px' },
                                    flexShrink: 0
                                }}>
                                    <Skeleton
                                        variant="rectangular"
                                        height={{ xs: 240, sm: 280, md: 320 }}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </Box>
                            ))}
                        </>
                    )}

                    {/* Error message */}
                    {error && !loading && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '200px',
                            p: 2
                        }}>
                            <Typography color="error" variant="body2">
                                Error loading stories
                            </Typography>
                        </Box>
                    )}

                    {/* Existing Story Cards */}
                    {!loading && cardsDetails.map((card, index) => (
                        <Box
                            key={index}
                            sx={{
                                minWidth: { xs: '160px', sm: '200px', md: '220px' },
                                flexShrink: 0
                            }}
                        >
                            <VegitableStoryCard
                                title={card.title}
                                content={card.content}
                                user={card.user}
                                photo={card.photo}
                            />
                        </Box>
                    ))}

                    {/* Show message if no stories available */}
                    {!loading && cardsDetails.length === 0 && !error && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '300px',
                            p: 3,
                            textAlign: 'center'
                        }}>
                            <Box>
                                <Typography color="text.secondary" variant="h6" gutterBottom>
                                    📚 No stories yet
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    Be the first to share your farming story with the community!
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Posts section with improved layout */}
            <Box sx={{
                width: '100%',
                maxWidth: '100%',
                mx: 'auto'
            }}>
                {/* Tabs for different post types */}
                <Box sx={{ 
                    backgroundColor: 'white',
                    borderRadius: { xs: 0, sm: 2 },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    mb: 2
                }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        aria-label="post tabs"
                        variant="fullWidth"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                py: 2
                            },
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px 3px 0 0'
                            }
                        }}
                    >
                        <Tab 
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography>🌍 Community Posts</Typography>
                                    {sharedPosts.length > 0 && (
                                        <Chip 
                                            label={sharedPosts.length} 
                                            size="small" 
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </Box>
                            }
                        />
                    </Tabs>
                </Box>

                {/* Community Posts Tab Panel */}
                {selectedTab === 0 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Box sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '100%', md: '800px', lg: '900px' },
                            px: { xs: 1, sm: 2 }
                        }}>
                            {postsLoading && (
                                <Box>
                                    {[1, 2, 3].map((index) => (
                                        <PostSkeleton key={index} />
                                    ))}
                                </Box>
                            )}

                            {postsError && (
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mb: 2,
                                        borderRadius: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    action={
                                        <Button
                                            color="inherit"
                                            size="small"
                                            onClick={fetchSharedPosts}
                                        >
                                            Retry
                                        </Button>
                                    }
                                >
                                    Error loading community posts: {postsError}
                                </Alert>
                            )}

                            {!postsLoading && !postsError && sharedPosts.length === 0 && (
                                <Box sx={{ 
                                    textAlign: 'center', 
                                    py: 8,
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <Typography variant="h4" sx={{ mb: 2 }}>
                                        🌱
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No community posts yet
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        Be the first to share your farming experience with the community!
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => setShareDialogOpen(true)}
                                        sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                                    >
                                        Share Your Story
                                    </Button>
                                </Box>
                            )}

                            {!postsLoading && sharedPosts.length > 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {sharedPosts.map((post) => (
                                        <VegitablePost 
                                            key={`${post.id}-${Date.now()}`}
                                            post={post} 
                                            onBidSubmitted={refreshSharedPosts}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* ShareStoryForm component */}
            <ShareStoryForm
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                currentUser={currentUser}
                onSuccess={handleStoryUploadSuccess}
            />
        </Box>
    );
}
