import VegitableStoryCard from "./CardComponent";
import VegitablePost, { VegitablePostProps } from "./VegitablePost";
import { Box, Typography } from '@mui/material';


const cardsDetails = [
    {
        title: "Red Chilies from Anuradhapura",
        content: "Locally grown in the dry zone of Anuradhapura, these chilies are renowned for their intense heat and vibrant red color. The region’s arid climate and well-drained soil create perfect conditions for cultivating high-quality chilies, widely used in Sri Lankan cuisine to spice up curries, sambols, and condiments.",
        user: "Mahaweli Farms",
        photo: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Crops"
    },
    {
        title: "Organic Brinjals from Kurunegala",
        content: "These fresh brinjals are cultivated in Kurunegala using eco-friendly methods such as organic fertilizers and natural pest control. Free from harmful chemicals, they’re grown sustainably with practices like crop rotation, making them a healthy choice for Sri Lankan curries and side dishes.",
        user: "Green Lanka Organics",
        photo: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Crops"
    },
    {
        title: "Nutritious Ceylon Spinach from Matale",
        content: "Grown in the fertile soils of Matale’s small farms, Ceylon Spinach (Nivithi) is a nutrient-rich leafy green packed with vitamins A and C, iron, and calcium. It’s a staple in Sri Lankan diets, often prepared as ‘mallung,’ a traditional dish mixed with coconut and spices.",
        user: "Lanka Greens",
        photo: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Crops"
    },
    {
        title: "Fresh Okra from Polonnaruwa",
        content: "Harvested daily in Polonnaruwa, this okra is cultivated using drip irrigation, a technique that conserves water while ensuring consistent quality. Rich in fiber and antioxidants, it’s a versatile vegetable enjoyed in Sri Lankan curries and stir-fries.",
        user: "Agro Lanka Co-op",
        photo: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Crops"
    },
    {
        title: "Alert: Crop Diseases Affecting Tomatoes and Peppers",
        content: "Sri Lankan farmers are tackling serious fungal and bacterial diseases, including Early Blight (caused by Alternaria solani) affecting tomatoes and Bacterial Wilt (caused by Ralstonia solanacearum) impacting peppers and other crops. Early detection and management are crucial to prevent significant losses.",
        user: "AgriWatch Sri Lanka",
        photo: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Alerts"
    },
    {
        title: "Record Mango Harvest in Southern Province",
        content: "The Southern Province has celebrated a record-breaking mango harvest this season, driven by optimal weather and advanced farming techniques. This abundant yield is set to enhance local exports and uplift the livelihoods of farmers across the region.",
        user: "Daily Agro News",
        photo: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Suggested: Replace with an image of a mango harvest in Sri Lanka, e.g., farmers picking mangoes or crates of ripe fruit
        category: "News"
    }
];
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
    return (
        <Box sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '100%', md: '800px', lg: '1300px' },
            mx: 'auto',
            px: { xs: 0, sm: 1, md: 2 }
        }}>
            {/* Stories section */}
            {/* Stories section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1, pl: { xs: 1, sm: 1, md: 0 } }}>
                    Latest Updates
                </Typography>
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
                    {cardsDetails.map((card, index) => (
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
                </Box>
            </Box>

            {/* Posts section */}
            <Box sx={{
                width: '100%',
                maxWidth: '100%', // Use full width
                mx: 'auto',
                px: { xs: 0, sm: 1, md: 2 },
                backgroundColor: '#ffffff'
            }}>
                {/* Stories section */}
                <Box sx={{ mb: 4, backgroundColor: '#ffffff' }}>
                    {/* Story content remains the same */}
                </Box>

                {/* Posts section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                }}>
                    <Box sx={{
                        width: { xs: '100%', sm: '80%', md: '60%', lg: '50%' }, // Responsive width
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
        </Box>
    );
}