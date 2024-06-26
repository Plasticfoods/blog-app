import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import createBlogUrl from '../helper/createBlogUrl';
import { Link } from 'react-router-dom';


export default function MediumBlogs({ profile, blogs, isCurrentUser, deleteBlog }) {

    if (blogs.length === 0) {
        return (
            <div className="medium-blogs">
                <h2 className="gray-text" style={{ textAlign: 'center', marginTop: '1rem' }}>No stories yet</h2>
            </div>
        )

    }

    return (
        <div className="medium-blogs">
            <h2 className="title">Stories of @{profile.username}</h2>
            <div className="blogs auto-grid">
                {blogs.map((blog, index) => {
                    return <MediumBlog2
                        key={index}
                        blog={blog}
                        profile={profile}
                        isCurrentUser={isCurrentUser}
                        deleteBlog={deleteBlog}
                    />
                })}
            </div>
        </div>
    )
}

export function MediumBlog({ blog, username }) {

    return (
        <Card className='medium-blog' sx={{ border: 'none', boxShadow: 'none' }}>
            <CardMedia
                sx={{ height: 140 }}
                image={blog.imageUrl}
                title="image"
            />
            <CardContent>
                <Typography gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    @{username}
                </Typography>
                <Typography gutterBottom variant='h5' component="div" sx={{ fontWeight: 600, lineHeight: '2ch' }}>
                    {blog.title}
                </Typography>
                <Typography variant="body" color="text.secondary">
                    {blog.summary}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', margin: 0, padding: 0 }}>
                <Button size="small">Delete</Button>
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}

export function MediumBlog2({ blog, profile, isCurrentUser, deleteBlog }) {
    let summary = '';
    if (blog.summary && blog.summary.length > 70) {
        summary = blog.summary.substring(0, 70) + '...';
    } else {
        summary = blog.summary; // Assign the original summary if it is less than or equal to 70 characters
    }


    console.log('Summary: ', blog.summary, summary)

    return (
        <Card className='medium-blog' sx={{ maxWidth: '400px' }}>
            <CardMedia
                sx={{ height: 220 }}
                image={blog.imageUrl}
                title="image"
            />
            <CardContent>
                <Typography gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    @{profile.username}
                </Typography>
                <Typography gutterBottom variant='h5' component="div" sx={{ fontWeight: 600, lineHeight: '2ch', fontSize: '1.4rem' }}>
                    <Link
                        to={createBlogUrl(blog.title, blog._id)}
                    >
                        {blog.title}
                    </Link>
                </Typography>
                <Typography variant="body" color="text.secondary" sx={{ fontWeight: 600, lineHeight: '2ch' }}>
                    {summary}
                </Typography>
                <div className="card-actions pt-4">
                    {isCurrentUser &&
                        <Button color='error' variant='outlined'
                            sx={{ fontWeight: 500, borderRadius: '20px' }}
                            onClick={() => deleteBlog(blog._id)}
                        >
                            Delete
                        </Button>
                    }
                </div>
            </CardContent>

        </Card>
    )
}