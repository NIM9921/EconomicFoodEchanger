import { useState, useEffect } from 'react';
import VegitableStoryCard from "./CardComponent";
import VegitablePost, { VegitablePostProps } from "./VegitablePost";
import { Box, Typography, CircularProgress, Card, CardContent, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
// Add this import at the top of your main component file
import SharePostForm from './sharestory/SharePostForm.tsx';

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
            <Card sx={{
                width: 250,
                minWidth: 250,
                margin: '8px',
                height: 400, // Exact same as VegitableStoryCard
                borderRadius: 1,
                border: '1px solid #c8e6c9',
            }}>
                <Skeleton variant="rectangular" width="100%" height="240" />
                <Box sx={{ p: 2 }}>
                    <Skeleton width="80%" height={20} />
                    <Skeleton width="60%" height={15} sx={{ mt: 0.5 }} />
                </Box>
            </Card>
        );
    }

    return (
        <Card
            onClick={onClick}
            sx={{
                width: 250, // Exact same as VegitableStoryCard
                minWidth: 250, // Exact same as VegitableStoryCard
                margin: '8px', // Exact same as VegitableStoryCard
                height: 400, // Exact same as VegitableStoryCard
                boxShadow: 2, // Exact same as VegitableStoryCard
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
            {/* Background Image Section - same height as CardMedia in VegitableStoryCard */}
            <Box sx={{
                height: 240, // Exact same as CardMedia height in VegitableStoryCard
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

            {/* Content Section - same structure as CardContent in VegitableStoryCard */}
            <CardContent sx={{
                height: 'calc(400px - 240px)', // Remaining height after image section
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'rgba(240, 247, 235, 0.4)',
                pt: 4 // Extra padding top to account for overlapping button
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
            </CardContent>
        </Card>
    );
};

const postsData: VegitablePostProps[] = [
    {
        title: "Fresh Organic Vegetables Available",
        user: "Farmer John",
        userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        timestamp: "Today at 10:23 AM",
        content: "Fresh organic vegetables from my farm. Harvested this morning and ready for delivery. Looking for buyers interested in premium quality produce.",
        tags: ["Organic", "LocalProduce", "FarmToTable"],
        category: "selling",
        images: [
            {
                img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
                title: "Tomatoes",
                featured: true
            },
            {
                img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
                title: "Leafy Greens"
            },
            {
                img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
                title: "Root Vegetables"
            }
        ],
        likes: 24,
        comments: 5
    },
    {
        title: "Looking for Fresh Spinach Bulk Supply",
        user: "Green Grocers",
        userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        timestamp: "Yesterday at 3:15 PM",
        content: "Our restaurant needs a regular supply of fresh spinach. Looking for local farmers who can provide 50kg per week. Organic preferred. Please contact with pricing details.",
        tags: ["SpinachNeeded", "BulkBuying", "RestaurantSupply"],
        category: "buying",
        images: [
            {
                img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
                title: "Spinach",
                featured: true
            }
        ],
        likes: 12,
        comments: 8
    },
    {
        title: "Premium Rice Harvest Ready for Sale",
        user: "Rice Fields Co-op",
        userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
        timestamp: "2 days ago",
        content: "This season's rice harvest is ready. Premium quality, pesticide-free. Available in bulk quantities. Special price for regular buyers.",
        tags: ["RiceHarvest", "PremiumQuality", "BulkSale"],
        category: "selling",
        images: [
            {
                img: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
                title: "Rice Fields",
                featured: true
            },
            {
                img: "https://images.unsplash.com/photo-1595436252086-7496fb8c53d9",
                title: "Rice Grains"
            }
        ],
        likes: 38,
        comments: 7
    }
];

export default function Home() {
    const [cardsDetails, setCardsDetails] = useState<CardDetails[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // Add this state variable with your other useState declarations
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

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

    // Function to fetch current user data (mock for now - replace with your API)
    const fetchCurrentUser = async () => {
        try {
            setUserLoading(true);
            // Mock current user data - replace with your actual API call
            // const response = await fetch('http://localhost:8080/user/current');
            
            // For now, using mock data - replace this with actual API call
            const mockUser: CurrentUser = {
                id: 1,
                name: "",
                username: "create farmer",
                profileImage: null, // Will use gradient background
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

    // Update your handleAddStoryClick function
    const handleAddStoryClick = () => {
        console.log("Add story clicked for user:", currentUser?.name);
        setShareDialogOpen(true);
    };

    // Add this function to handle successful story upload
    const handleStoryUploadSuccess = () => {
        // Refresh the stories list
        fetchStoryData();
    };

    // Function to fetch story data from API
    const fetchStoryData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/sharestory/all');
            
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
    }, []);

    return (
        <Box sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '100%', md: '800px', lg: '1300px' },
            mx: 'auto',
            px: { xs: 0, sm: 1, md: 2 }
        }}>
            {/* Stories section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1, pl: { xs: 1, sm: 1, md: 0 } }}>
                    Latest Updates
                </Typography>
                
                {/* Stories list with Add Story card first */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: { xs: "8px", sm: "12px", md: "16px" },
                        width: "100%",
                        maxWidth: "100%",
                        overflowX: "auto",
                        padding: { xs: "12px 8px", sm: "16px 8px" },
                        pb: 2,
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "thin",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                            height: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "rgba(0, 0, 0, 0.05)",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#bdbdbd",
                            borderRadius: "4px",
                        },
                    }}
                >
                    {/* Add Story Card - Always first (Facebook style) */}
                    <Box sx={{
                        minWidth: { xs: '140px', sm: '180px', md: '200px' },
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
                            {[1, 2, 3].map((index) => (
                                <Box key={index} sx={{
                                    minWidth: { xs: '140px', sm: '180px', md: '200px' },
                                    flexShrink: 0
                                }}>
                                    <Skeleton 
                                        variant="rectangular" 
                                        height={{ xs: 200, sm: 220, md: 240 }}
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
                                minWidth: { xs: '140px', sm: '180px', md: '200px' },
                                height: { xs: 'auto', sm: 'auto' },
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
                            minWidth: '200px',
                            p: 2
                        }}>
                            <Typography color="text.secondary" variant="body2">
                                No stories yet. Be the first!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Posts section */}
            <Box sx={{
                width: '100%',
                maxWidth: '100%',
                mx: 'auto',
                px: { xs: 0, sm: 1, md: 2 },
                backgroundColor: '#ffffff'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                }}>
                    <Box sx={{
                        width: { xs: '100%', sm: '80%', md: '60%', lg: '50%' },
                        minWidth: { xs: '100%', sm: '280px' },
                        px: { xs: 1, sm: 2 }
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {postsData.map((post, index) => (
                                <VegitablePost key={index} {...post} />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* Add the SharePostForm component before the closing Box tag in your JSX */}
            <SharePostForm
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                currentUser={currentUser}
                onSuccess={handleStoryUploadSuccess}
            />
        </Box>
    );
}