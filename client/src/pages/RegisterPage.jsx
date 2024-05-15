import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import image from '../images/authImage.webp';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBlog } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import {base_url, api_url} from '../helper/variables.js'
import axios from 'axios';
import { CircularProgress } from '@mui/material';


export default function RegisterPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
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
        setLoading(true)

        for (const property in userDetails) {
            if(userDetails[property] === '') {
                alert(`${property} is required`)
                setLoading(false)
                return
            }
        }

        if(userDetails.password !== userDetails.confirmPassword) {
            alert('Password does not match')
            setUserDetails({
                ...userDetails,
                confirmPassword: ''
            })
            setLoading(false)
            return
        }

        try {
            const response = await axios.post(`${api_url}auth/register`, userDetails, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            console.log("Res after register: ", response.data)
            // alert(response.data.message)
            navigate('/auth/login')
        } catch(err) {
            if(err.response.status === 409) {
                alert(err.response.data.message)
                setUserDetails({
                    ...userDetails,
                    [err.response.data.key]: ''
                })
            } else {
                alert(err.message)                
            }
        } finally {
            setLoading(false)
        }

        // fetch(`${api_url}auth/register`, {
        //     method: 'POST',
        //     body: JSON.stringify(userDetails),
        //     headers: {
        //         "Content-type": "application/json"
        //     },
        // })
        // .then(res => {
        //     if(res.status === 500) navigate('/error/500')
        //     return res.json()    
        // })
        // .then(data => {
        //     if(data.success) {
        //         alert(data.message)
        //         navigate('/auth/login')
        //         return
        //     }
        //     setUserDetails({
        //         ...userDetails,
        //         [data.key]: ''
        //     })
        //     alert(data.msg)
        // })
        // .catch(err => console.log(err))
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
                    <TextField fullWidth label="Name" id="name"  size='small' onChange={handleChange}  value={userDetails.name} required />
                    <TextField fullWidth label="Username" id="username" size='small' onChange={handleChange}  value={userDetails.username} required />
                    <TextField fullWidth label="Email" id="email" size='small' onChange={handleChange}  value={userDetails.email} required />
                    <TextField fullWidth label="Password" id="password" size='small' type='password' onChange={handleChange}  value={userDetails.password} required />
                    <TextField fullWidth label="Confirm password" id="confirmPassword" size='small' type='password' onChange={handleChange}  value={userDetails.confirmPassword} required />
                    <Button variant="contained" size='large' onClick={register} disabled={loading}>
                        {loading ? 
                            <CircularProgress size={35} /> : 'Sign up'
                        }
                    </Button>
                </div>
                <p className='text-center'>Alredy have an account? <Link to='/auth/login' className='underline decoration-1 font-medium'>Sign in</Link></p>
            </div>
        </div>
    )
}