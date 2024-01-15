import { Link } from "react-router-dom";
// logo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBlog } from '@fortawesome/free-solid-svg-icons' 
import { useState, useEffect } from "react"
import { base_url, api_url } from '../helper/variables.js'


export default function Header() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState('')

    useEffect(() => {

        fetch(`${api_url}myprofile`, {
            method: 'GET',
            // necessary to store access token in browser
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if(!data.loggedIn) {
                setLoggedIn(false)
                return
            }
            setLoggedIn(true)
            setUsername(data.userData.username)
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <div className="header flex">
            <h1 className="logo-title flex grow-[3] gap-4">
                <div className="logo">
                    <FontAwesomeIcon icon={faBlog} size='2x' />
                </div>
                <Link to='/'>
                    <h1 className="name">Skeleton</h1>
                </Link>
            </h1>
            <ul className="navbar grow-[1] flex justify-between items-center">
                <Link className="nav-item">Our Story</Link>
                <Link className="nav-item">Membership</Link>
                <Link className="nav-item"> Tags</Link>
                {loggedIn ? (
                    <>
                        <Link to={`/${username}`} className="nav-item">Profile</Link>
                        <Link to={'/create'}> <button className="btn btn-action">Write</button> </Link>
                    </>
                ) : (
                    <>
                        <Link to='/auth/login' className="nav-item">Sign in</Link>
                        <Link to='/auth/register'> <button className="btn btn-action">Get started</button> </Link>
                    </>
                )}


            </ul>
        </div>
    );
}