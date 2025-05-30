import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface VegitableStoryCardProps {
    title: string;
    content: string;
    user: string;
    photo: string;
}

export default function VegitableStoryCard({ title, content, user, photo }: VegitableStoryCardProps) {
    return (
        <Card sx={{ width: 250, minWidth: 250, margin: '8px', boxShadow: 2, height: 400 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="240"
                    image={photo}
                    alt={title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {content}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                        Posted by: {user}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}