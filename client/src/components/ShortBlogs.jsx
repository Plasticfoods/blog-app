import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { base_url, api_url } from '../helper/variables.js'

const path = 'single-post'
const blogUrl = base_url + path

const blogs1 = [{ imageLink: 'https://miro.medium.com/v2/resize:fit:828/format:webp/1*jyZQjnQAlcoeNCQ8oBkujA.jpeg' },
{ imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png' },
{ imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/0*jxVHjlRyDYVgFuyE' },
{ imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png' },
{ imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png' },
{ imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png' },
{ imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png' }
]

function getBlogUrl(title, blogId) {
    title = title.toLowerCase()
    let path = title.split(' ').join('-')
    path += '-' + blogId
    return base_url + 'posts/' + path
}

function extractDate(dateString) {
    const date = new Date(dateString)
    var monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return monthNames[date.getMonth()] + ' ' + date.getDate()
}

export default function ShortBlogs() {

    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        fetch(`${api_url}posts`, {
            method: 'GET',
            // withCredentials: true,
            // credentials: 'include'
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                setBlogs(json)
            })
            .catch(err => console.log(err))
    }, [])


    return (
        <section className="short-blogs">
            {blogs.length > 0 ? (
                blogs.map((element, index) => (
                    <div className="short-blog" key={index} id={element._id}>
                        {/* Author name, title, content, etc. */}
                        <div className="short-blog-left">
                            <Link className="short-blog-author-name link" to={`${base_url}${element.username}`}>
                                {element.username}
                            </Link>
                            <Link className="short-blog-title link" to={getBlogUrl(element.title, element._id)}>
                                {element.title}
                            </Link>
                            <p className="short-blog-content">
                                {`${element.content.substring(0,120)}...`}
                            </p>
                            <div className="short-blog-details">
                                <p className="date"> {extractDate(element.uploadDate)} </p>
                                <div>.</div>
                                <Link className="tag-name link">{element.category}</Link>
                            </div>
                        </div>
                        {/* Blog Image */}
                        <picture className="short-blog-right">
                            <img
                                src={element.imageUrl}
                                alt="blog image"
                                className="short-blog-image"
                            />
                        </picture>
                    </div>
                ))
            ) : (
                <div className="text-center loading">Loading Posts...</div>
            )
            }
        </section>
    );

}