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
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchBlogsData = async (page) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page,
                limit: 10
            })

            const response = await axios.get(`${api_url}posts?${params}`)
            
            // Handle pagination response structure
            if (response.data.pagination) {
                setBlogs(response.data.blogs)
                setTotalPages(response.data.pagination.totalPages)
            } else {
                setBlogs(response.data)
                setTotalPages(1)
            }
        } catch (err) {
            if (err.response) {
                const responseData = err.response.data
                setError(responseData.message)
            } else if (err.request) {
                console.log(err)
                setError(err.message)
            } else {
                setError('Something Went Wrong')
            }
            setBlogs([])
            setTotalPages(1)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogsData(currentPage)
    }, [currentPage])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    if(loading) {
        return <LoadingScreen />
    }

    if(error !== null) {
        return <ErrorScreen errorMessage={error} />
    }

    // return <LoadingScreen />

    return (
        <section className="short-blogs">
            {/* Blogs Section */}
            <section className="short-blogs-inner">
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

            {/* Pagination Footer */}
            {blogs.length > 0 && (
                <div className="pagination-footer mt-8 flex justify-center gap-2 items-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        ← Previous
                    </button>
                    
                    <span className="px-4 py-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next →
                    </button>
                </div>
            )}
        </section>
    );

}