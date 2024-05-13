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
    const [user, setUser] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                await getUserData()
                await fetchBlogData()
            } catch (err) {
                console.log(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        })()

        async function fetchBlogData() {
            const response = await axios.get(`${api_url}posts/${postId}`)
            setBlogData(response.data)
            setHtml(response.data.content)
        }

        async function getUserData() {
            const response = await axios.get(`${api_url}myprofile`, {
                withCredentials: true,
                credentials: 'include'
            })
            setUser(response.data.userData)
            setLoggedIn(response.data.loggedIn)
        }
    }, [])

    if (blogData === null) {
        return (
            <article className="blog-post">
                <Header2 user={user} loggedIn={loggedIn} />
                <LoadingContainer />
            </article>
        )
    }

    if (error !== null) {
        return (
            <article className="blog-post">
                <Header2 user={user} loggedIn={loggedIn} />
                <div className="error-container">
                    <div>{error}</div>
                </div>
            </article>
        )
    }

    console.log(blogData)

    return <article className="blog-post">
        <Header2 user={user} loggedIn={loggedIn} />
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