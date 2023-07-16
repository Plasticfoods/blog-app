import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header2 from '../components/Header2'
const base = 'http://localhost:7000/'


export default function Profile() {
    const {username} = useParams()
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState([])
    const [userInfo, setUserInfo] = useState(null)

    // getting user detail
    useEffect(() => {
        fetch(`${base}${username}`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(json => {
            setUserInfo(json)
        })
        .catch(err => console.log(err))
    }, [])

    // getting user blog posts
    useEffect(() => {
        fetch(`${base}${username}/posts`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(json => {
            setBlogs(json.blogs)
        })
    }, [])

    function logout(e) {
        fetch('http://localhost:7000/auth/logout', {
            method: 'POST',
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(json => {
            console.log('logged out')
            navigate('/')
        })
        .catch(err => console.log(err))
    }


    return (
        <div className="profile">
            <Header2 />
            <main>
                
            </main>
            <button onClick={logout} type='button'>Logout</button>
        </div>
    )
}