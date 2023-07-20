import profileIcon from '../images/user-profile-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // logo, write icon
import { Link } from 'react-router-dom';
import { base_url, api_url } from '../helper/variables'
import { useState } from 'react';
const createPostUrl = `${base_url}new-story`


export default function Header2(props) {

    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState('')

    return (
        <header className="header2 mobile-padding pt-3">
            <div className="logo-title flex flex-row gap-2 lg:gap-6">
                <Link to='/' className='logo'>
                    <FontAwesomeIcon icon={faBlog} size='2x' />
                </Link>
                <div className="name">Skeleton</div>
            </div>
            <div className='nav-icons flex flex-row items-center lg:gap-6 gap-4'>
                {loggedIn ?
                    ( 
                    <>
                        <button onClick={(e) => props.logout(e)} >logout</button>
                        <Link className='flex gap-2' to={createPostUrl}>
                            <FontAwesomeIcon icon={faPenToSquare} className='write-icon' />
                            <p>Write</p>
                        </Link>
                        <Link className="profile-icon" to={`${base_url}${username}`}>
                            <img src={profileIcon} alt="profile icon" />
                        </Link>
                    </>)
                    : (
                        <>
                            <Link className='btn-sign-up' to={`${base_url}auth/register`}>Sign up</Link>
                            <Link className='btn-sign-in' to={`${base_url}auth/login`}>Sign in</Link>
                        </>
                    )
                }

            </div>
        </header>
    );
}

