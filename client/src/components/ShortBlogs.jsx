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
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [sortBy, setSortBy] = useState('uploadDate')
    const [order, setOrder] = useState('desc')

    const fetchBlogsData = async (page, category, sort, direction) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page,
                limit: 10,
                sortBy: sort,
                order: direction,
                category: category
            })

            const response = await axios.get(`${api_url}posts?${params}`)
            
            // Handle new response structure with pagination metadata
            if (response.data.pagination) {
                setBlogs(response.data.blogs)
                setTotalPages(response.data.pagination.totalPages)
            } else {
                // Fallback for legacy API responses (if needed during transition)
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
        fetchBlogsData(currentPage, selectedCategory, sortBy, order)
    }, [currentPage, selectedCategory, sortBy, order])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleSortChange = (newSort) => {
        setSortBy(newSort)
        setCurrentPage(1)
    }

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder)
        setCurrentPage(1)
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
        setCurrentPage(1)
    }

    if(loading) {
        return <LoadingScreen />
    }

    if(error !== null) {
        return <ErrorScreen errorMessage={error} />
    }

    // return <LoadingScreen />

    return (
        <section className="short-blogs-container">
            {/* Pagination and Filter Controls */}
            <div className="pagination-controls mb-6 flex gap-4 flex-wrap items-center">
                {/* Category selector */}
                <select 
                    value={selectedCategory} 
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-3 py-2 border rounded"
                >
                    <option value="All">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Other">Other</option>
                </select>

                {/* Sort selector */}
                <select 
                    value={sortBy} 
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border rounded"
                >
                    <option value="uploadDate">Sort by Date</option>
                    <option value="category">Sort by Category</option>
                </select>

                {/* Order toggle */}
                <button 
                    onClick={() => handleOrderChange(order === 'desc' ? 'asc' : 'desc')}
                    className="px-3 py-2 border rounded"
                >
                    {order === 'desc' ? '↓ Newest' : '↑ Oldest'}
                </button>
            </div>

            {/* Blogs Section */}
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