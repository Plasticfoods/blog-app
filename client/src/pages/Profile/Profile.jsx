import './Profile.css';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import Header2 from '../../components/Header2';
import profileIcon from '../../images/user-profile-icon.svg';
import MediumBlogs from '../../components/MediumBlogs';
import { api_url, base_url } from '../../helper/variables';
import axios from 'axios';

function Profile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [blogs, setBlogs] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        setLoading(true)
        ;(async function () {
            try {
                await getUserData()
                await getProfileData()
                await getProfileBlogs()
            } catch (err) {
                console.log(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        })()

        async function getUserData() {
            const response = await axios.get(`${api_url}myprofile`, {
                withCredentials: true,
                credentials: 'include'
            })
            setUser(response.data.userData)
            setLoggedIn(response.data.loggedIn)
        }

        async function getProfileData() {
            const response = await axios.get(`${api_url}users/${username}`, {
                withCredentials: true,
                credentials: 'include'
            })
            setProfile(response.data)
            if(user !== null) {
                setIsCurrentUser(user._id === profile._id)
            }
        }

        async function getProfileBlogs() {
            const response = await axios.get(`${api_url}users/${username}/posts`, {
                withCredentials: true,
                credentials: 'include'
            })
            console.log(response.data)
            setBlogs(response.data.blogs)
        }
    }, [username])

    if (error) return (
        <div>
            <h1>{error}</h1>
        </div>
    )

    if (loading) return (
        <div style={{ paddingTop: '10rem' }}>
            <LoadingScreen />
        </div>
    )


    return (
        <div className='profile'>
            <Header2 user={user} loggedIn={loggedIn} />
            {/* User info  */}
            <div>
                <section className="user-details">
                    <div className='flex flex-col gap-0 justify-center'>
                        <h2 className="user-name">
                            {profile.name}
                        </h2>
                        <p className='gray-text'>A Skeleton user</p>
                        <p className='gray-text'>@{profile.username}</p>
                        {isCurrentUser && <Link className='edit-profile'>Edit Profile</Link>}
                    </div>
                    <picture className='user-image'>
                        <img src={profileIcon} alt="profile image" />
                    </picture>
                </section>
            </div>
            {/* Blogs */}
            <MediumBlogs isCurrentUser={isCurrentUser} blogs={blogs} profile={profile} />

        </div>
    );
}

export default Profile;