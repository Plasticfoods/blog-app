import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base_url, api_url } from '../helper/variables.js';
import getShortSummary from '../helper/getShortSummary.js';
import createBlogUrl from '../helper/createBlogUrl.js';
import axios from 'axios';
import LoadingScreen from './LoadingScreen.jsx';
import ErrorScreen from './ErrorScreen.jsx';


function extractDate(dateString) {
    const date = new Date(dateString);
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthNames[date.getMonth()] + ' ' + date.getDate();
}


/**
 * CategoryFeedBlogs
 * Parameterised, paginated version of ShortBlogs.jsx scoped to a single category.
 * Reuses all existing short-blog CSS classes from index.css.
 *
 * @param {string} categoryName - the category to filter posts by
 */
export default function CategoryFeedBlogs({ categoryName }) {
    const [blogs, setBlogs]           = useState([]);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBlogsData = async (page, category) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: 10,
                category: category
            });

            const response = await axios.get(`${api_url}posts?${params}`);

            if (response.data.pagination) {
                setBlogs(response.data.blogs);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                setBlogs(response.data);
                setTotalPages(1);
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else if (err.request) {
                setError(err.message);
            } else {
                setError('Something Went Wrong');
            }
            setBlogs([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Reset to page 1 whenever the category changes, then fetch
    useEffect(() => {
        setCurrentPage(1);
        setError(null);
    }, [categoryName]);

    useEffect(() => {
        fetchBlogsData(currentPage, categoryName);
    }, [currentPage, categoryName]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error !== null) {
        return <ErrorScreen errorMessage={error} />;
    }

    return (
        <section className="category-feed-section">
            {/* Blog list */}
            <section className="category-grid-container">
                {blogs.length > 0 ? (
                    blogs.map((element, index) => (
                        <div className="short-blog" key={index} id={element._id}>
                            {/* Author name, title, content */}
                            <div className="short-blog-left">
                                <Link
                                    className="short-blog-author-name link"
                                    to={`${base_url}${element.username}`}
                                >
                                    {element.username}
                                </Link>
                                <Link
                                    className="short-blog-title link"
                                    to={createBlogUrl(element.title, element._id)}
                                >
                                    {element.title}
                                </Link>
                                <div className="short-blog-content">
                                    {getShortSummary(element.summary)}
                                </div>
                                <div className="short-blog-details">
                                    <p className="date">{extractDate(element.uploadDate)}</p>
                                    <div>.</div>
                                    <Link
                                        className="tag-name link"
                                        to={`/posts/tag/${element.category}`}
                                    >
                                        {element.category}
                                    </Link>
                                </div>
                            </div>
                            {/* Blog image */}
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
                )}
            </section>

            {/* Pagination footer */}
            {blogs.length > 0 && (
                <div className="pagination-footer mt-8 flex justify-center gap-2 items-center py-12">
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
