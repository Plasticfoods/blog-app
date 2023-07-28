import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { base_url, api_url } from '../helper/variables'
import { Link } from 'react-router-dom'

function getBlogUrl(title, blogId) {
    title = title.toLowerCase()
    let slug = title.split(' ').join('-')
    slug = slug.endsWith('.') ? slug.slice(0, -1) : slug;
    let path = slug + '-' + blogId
    return base_url + 'posts/' + path
}

function extractDate(dateString) {
    const date = new Date(dateString)
    var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
}


export default function ProfileBlogs() {

    const [blogs, setBlogs] = useState([])
    const [flag, setFlag] = useState(false)
    const { username } = useParams()

    useEffect(() => {
        fetch(`${api_url}users/${username}/posts`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => {
            if (!res.ok) setFlag(true)
            return res.json()
        })
        .then(data => {
            console.log('username = ' + username)
            if (data && data.blogs && data.blogs.length > 0) {
                setBlogs(data.blogs)
                console.log(blogs)
            } else {
                setFlag(true);
            }
        })
        .catch(err => console.log(err))
    }, [username])

    return (
        <section className="profile-blogs">
            <p className="text-base font-medium lg:text-lg">Lists</p>
            {(blogs.length == 0 && !flag) ? (
                <div className="profile-blogs-loading">Loading posts...</div>
            ) : (flag === true ? (
                <div className='no-blogs'>
                    <p>No posts to show</p>
                </div>
            ) : (
                blogs.map((element, index) => {
                    return (
                        <div className="short-blog profile-blog" key={index} id={index}>
                            {/* Author name, title, content etc.. */}
                            <div className="short-blog-left">
                                <div className="short-blog-date link">{extractDate(element.uploadDate)}</div>
                                <Link className="short-blog-title link" to={getBlogUrl(element.title, element._id)}>
                                    {element.title}
                                </Link>
                                <p className="short-blog-content">{element.content.substring(0, 90)}</p>
                                <Link className="short-blog-tag">{element.category}</Link>
                            </div>
                            {/* Blog Image */}
                            <picture className="short-blog-right">
                                <img src={element.imageUrl} alt="blog image" className="short-blog-image profile-blog-image" />
                            </picture>
                        </div>
                    );
                })
            ))}
        </section>
    );

}