import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import image from '../images/authImage.webp';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBlog } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

export default function RegisterPage() {

    const [userDetails, setUserDetails] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    function handleChange(event) {
        const {id, value} = event.target

        setUserDetails({
            ...userDetails,
            [id]: value
        })
    }

    async function register(event) {
        event.preventDefault()
        const response = await fetch('http://localhost:7000/auth/register', {
            method: 'POST',
            body: JSON.stringify(userDetails),
            headers: {
                "Content-type": "application/json"
            }
        })
        const resObject = await response.json();
        alert(resObject.msg)
        
    }


    return (
        <div className="register">
            <div className="image-content">
                <picture>
                    <img src={image} alt="image" />
                </picture>
            </div>

            <div className="container">
                <div className="icon">
                    <Link to='/'>
                        <FontAwesomeIcon icon={faBlog} size='2x'/>
                    </Link>
                </div>
                <p className='auth-title'>Create Account</p>
                <p className='subtitle'>Discover stories, thinking, and expertise from writers on any topic.</p>
                <div action="#" className='form mx-auto grid gap-7'>
                    <TextField fullWidth label="Name" id="name"  size='small' onChange={handleChange}  value={userDetails.name} />
                    <TextField fullWidth label="Username" id="username" size='small' onChange={handleChange}  value={userDetails.username} />
                    <TextField fullWidth label="Email" id="email" size='small' onChange={handleChange}  value={userDetails.email} />
                    <TextField fullWidth label="Password" id="password" size='small' type='password' onChange={handleChange}  value={userDetails.password} />
                    <TextField fullWidth label="Confirm password" id="confirmPassword" size='small' type='password' onChange={handleChange}  value={userDetails.confirmPassword} />
                    <Button variant="contained" size='large' onClick={register}>Sign up</Button>
                </div>
                <p className='text-center'>Alredy have an account? <Link to='/auth/login' className='underline decoration-1 font-medium'>Sign in</Link></p>
            </div>
        </div>
    )
}