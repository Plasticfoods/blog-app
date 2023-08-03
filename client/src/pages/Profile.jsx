import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, createContext } from 'react'
import Header2 from '../components/Header2'
import UserDetails from '../components/UserDetails'
import ProfileBlogs from '../components/ProfileBlogs'
import Footer from '../components/Footer'
import { base_url, api_url } from '../helper/variables'

const UserContext = createContext({}) 

function Profile() {
    const {username} = useParams()
    const navigate = useNavigate()
    const [userData, setUserData] = useState({})
    
    // returns user data if username is not valid it shows 404 page
    useEffect(() => {
        fetch(`${api_url}users/${username}`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => {
            if(res.status === 404) {
                navigate('*')
                return null
            }
            return res.json()
        })
        .then(data => {
            if(data !== null) setUserData(data)
        })
        .catch(err => console.log(err))
    }, [username])


    return (
        <UserContext.Provider value={userData}>
            <div className="profile">
                <Header2 />
                <UserDetails value={userData} />
                <div className='profile-main'>
                    <ProfileBlogs />
                </div>
                <Footer />
            </div>
        </UserContext.Provider>

    )
}

export {UserContext, Profile}