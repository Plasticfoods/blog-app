import { useState, useEffect } from 'react'
import { base_url, api_url } from '../helper/variables'
import { Link } from 'react-router-dom'

function getBlogUrl(title, blogId) {
    title = title.toLowerCase()
    let path = title.split(' ').join('-')
    path += '-' + blogId
    return base_url + path
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

    useEffect(() => {
        fetch(`${api_url}john12/posts`, {
            method: 'GET',
            // withCredentials: true,
            // credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setBlogs(data.blogs)
                if (data.blogs.length == 0) setFlag(true)
            })
            .catch(err => console.log(err))
    })

    return (
        <section className="profile-blogs">
            <p className="text-base font-medium lg:text-lg">Lists</p>
            {blogs.length === 0 ? (
                <div className="profile-blogs-loading">Loading posts...</div>
            ) : flag === true ? (
                <div className='no-blogs'>No posts to show</div>
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
            )}
        </section>
    );

}