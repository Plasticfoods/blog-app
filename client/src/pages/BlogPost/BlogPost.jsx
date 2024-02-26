import './BlogPost.css'
import Header2 from "../../components/Header2"
import { Link, useParams, useNavigate } from "react-router-dom"
import { base_url, api_url } from "../../helper/variables"
import { useEffect, useState } from "react"
import LoadingContainer from "../../components/LoadingContainer"
import axios from "axios"


function extractDate(dateString) {

    const date = new Date(dateString)
    var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
}


export default function BlogPost() {

    const navigate = useNavigate()
    const { combineId } = useParams()
    let index = combineId.lastIndexOf('-')
    const postId = combineId.slice(index + 1)

    const [blogData, setBlogData] = useState(null)
    const [html, setHtml] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBlogData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${api_url}posts/${postId}`)
                console.log(response)
                setBlogData(response.data)
                setHtml(response.data.content)
            } catch (err) {
                if (err.response) {
                    // The client was given an error response (5xx, 4xx)
                    const responseData = err.response.data
                    console.log(responseData)
                    setError(responseData.message)
                } else if (err.request) {
                    // The client never received a response, and the request was never left
                    console.log(err)
                    setError(err.message)
                } else {
                    // Anything else
                    console.log(err)
                    setError('Something Went Wrong')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchBlogData()
        // fetch(`${api_url}posts/${postId}`, {
        //     method: 'GET'
        // })
        // .then(res => {
        //     if(res.status === 404) {
        //         navigate('*')
        //         return null
        //     }
        //     if(res.status === 500) {
        //         navigate('/error/500')
        //         return null
        //     }
        //     return res.json()
        // })
        // .then(data => {
        //     if(data !== null) {
        //         setBlogData(data)
        //         setHtml(data.content)
        //     }
        // })
        // .catch(err => {
        //     console.log(err)
        // }) 
    }, [])

    if (blogData === null) {
        return (
            <article className="blog-post">
                <Header2 />
                <LoadingContainer />
            </article>
        )
    }

    if (error !== null) {
        return (
            <article className="blog-post">
                <Header2 />
                <div className="error-container">
                    <div>{error}</div>
                </div>
            </article>
        )
    }

    console.log(blogData)

    return <article className="blog-post">
        <Header2 />
        <section className="blog-area">
            <h1 className="blog-title">{blogData.title}</h1>
            <div className="blog-detail">
                <Link className="name text-base" to={`${base_url}${blogData.username}`}>{blogData.name}</Link>
                <div className="flex gap-3">
                    <Link className="category link text-sm">{blogData.category}</Link>
                    <p>*</p>
                    <p className="blog-date text-sm">{extractDate(blogData.uploadDate)}</p>
                </div>
            </div>
            <picture>
                <img src={blogData.imageUrl} className="blog-image" alt="blog image" />
            </picture>
            <div className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>
        </section>

        {/*{ blogData === null ? 
            <div className="text-center pt-7">Loading...</div> : 

            (<section className="blog-area">
                <h1 className="blog-title">{blogData.title}</h1>
                <div className="blog-detail">
                    <Link className="name text-base" to={`${base_url}${blogData.username}`}>{blogData.name}</Link>
                    <div className="flex gap-3">
                        <Link className="category link text-sm">{blogData.category}</Link>
                        <p>*</p>
                        <p className="blog-date text-sm">{extractDate(blogData.uploadDate)}</p>
                    </div>
                </div>
                <picture>
                    <img src={blogData.imageUrl} className="blog-image" alt="blog image" />
                </picture>
                <div className="blog-content">
                    <div dangerouslySetInnerHTML={ {__html: html}}></div>
                </div>
            </section>)
        } */}

    </article>
}