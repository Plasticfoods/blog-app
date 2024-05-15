import Header2 from "../../components/Header2"
import { useState, useEffect } from "react"
import Editor from "../../components/Editor";
import './CreateBlog.css'
import categories from "../../helper/categories";
import { base_url, api_url } from '../../helper/variables'
import { useNavigate } from "react-router-dom";
import createBlogUrl from "../../helper/createBlogUrl";
import DOMPurify from 'dompurify';
import LoadingScreen from "../../components/LoadingScreen";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";


function CreateBlog() {
    const navigate = useNavigate()
    const maxLength = 80

    const [user, setUser] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState(null)
    const [file, setFile] = useState(null)
    const [category, setCategory] = useState('Category')

    useEffect(() => {
        ;(async function () {
            try {
                setLoading(true)
                const response = await axios.get(`${api_url}myprofile`, {
                    withCredentials: true,
                    credentials: 'include'
                })
                setUser(response.data.userData)
                setLoggedIn(response.data.loggedIn)
            } catch (err) {
                console.log(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        })()

    }, [])

    const handleClick = () => {
        if(title == '' || summary == '' || content == '' || category == 'Category') {
            alert('Fill all the inputs')
            return
        }

        // Sanitize the user input with DOMPurify
        const sanitizedHTML = DOMPurify.sanitize(content);

        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', title)
        formData.append('summary', summary)
        formData.append('content', sanitizedHTML)
        formData.append('category', category)

        const postBlog = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${api_url}posts/`, {
                    method: 'POST',
                    body: formData,
                    // necessary to store access token in browser
                    withCredentials: true,
                    credentials: 'include'
                })
                const data = await response.json()

                if(!response.ok) {
                    alert(data.message)
                    navigate('/')
                    return
                }
                console.log(data)   
                const blogUrl = createBlogUrl(data.blog.title, data.blog._id)
                window.location.href = blogUrl;
            }
            catch(err) {
                console.log(err)
                alert('Server Error')
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        postBlog()
    }

    if(!user) return (
            <LoadingScreen />
    )
    if(error) return (<Typography variant="h4">{error}</Typography>)

    return (
        <div className="create-blog">
            <Header2 user={user} loggedIn={loggedIn} />
            <section className="fill-blog">
                {/* Title */}
                <textarea className="py-3 px-4 block w-full rounded-lg text-2xl border border-black"
                    rows="1" placeholder="Title" onChange={(e) => setTitle(e.target.value)} 
                    value={title} maxLength={maxLength}>
                </textarea>
                {/* Summary */}
                <textarea className="py-3 px-4 block w-full rounded-lg text-xl border border-black" 
                    rows="1" placeholder="Summary" onChange={(e) => setSummary(e.target.value)} value={summary}>
                </textarea>
                {/* Add Image */}
                <form>
                    <label for="file-input" className="sr-only">Choose file</label>
                    <input type="file" name="file-input" id="file-input" className="block w-full border border-black shadow-sm rounded-lg text-md focus:z-10 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600
                        file:py-3 file:px-4"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </form>
                {/* Rich Text Editor */}
                <Editor content={content} setContent={setContent} />
                {/* Category Options */}
                <select onChange={e => setCategory(e.target.value)} className="py-4 px-4 pe-9 block w-full border rounded-lg text-lg focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:ring-gray-600 text-black">
                    <option selected className="dark:text-gray-400">Category</option>
                    {categories.map((element, index) => {
                        return <option key={index}>{element}</option>;
                    })}
                </select>

                <button className="btn-add-blog ssp w-full text-white text-center text-lg font-bold py-3 px-4 rounded-lg" 
                    onClick={handleClick} type="button"
                    disabled={loading}
                >
                    {loading ? <CircularProgress /> : 'Publish!'}
                </button>
            </section>
        </div>
    )
}

export default CreateBlog
