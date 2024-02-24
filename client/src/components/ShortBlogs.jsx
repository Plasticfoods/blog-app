import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { base_url, api_url } from '../helper/variables.js'
import getShortSummary from "../helper/getShortSummary.js"
import createBlogUrl from "../helper/createBlogUrl.js"
import axios from 'axios'
import LoadingScreen from "./LoadingScreen.jsx"
import ErrorScreen from './ErrorScreen.jsx'


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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('Something Went Wrong')

    useEffect(() => {
        const fetchBlogsData = async() => {
            setLoading(true)
            try {
                const response = await axios.get(`${api_url}posts`)
                console.log('Short Blogs', response.data)
                setBlogs(response.data)
            } catch (err) {
                if (err.response) {
                    // The client was given an error response (5xx, 4xx)
                    const responseData = err.response.data
                    setError(responseData.message)
                } else if (err.request) {
                    // The client never received a response, and the request was never left
                    console.log(err)
                    setError(err.message)
                } else {
                    // Anything else
                    setError('Something Went Wrong')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchBlogsData()
    }, [])

    if(loading) {
        return <LoadingScreen />
    }

    if(error !== null) {
        return <ErrorScreen errorMessage={error} />
    }

    // return <LoadingScreen />

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
                            <Link className="short-blog-title link" to={createBlogUrl(element.title, element._id)}>
                                {element.title}
                            </Link>
                            <div className="short-blog-content">
                                { getShortSummary(element.summary) }
                            </div>
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
                <div className="text-center loading">No posts to show</div>
            )
            }
        </section>
    );

}