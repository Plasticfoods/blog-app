import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputAdornment, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBlog, faL } from '@fortawesome/free-solid-svg-icons'
import { base_url, api_url } from '../helper/variables.js'


export default function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [userDetails, setUserDetails] = useState({ email: '', password: '' })

    function handleChange(e) {
        const { id, value } = e.target
        setUserDetails({
            ...userDetails,
            [id]: value
        })
    }

    async function login(e) {
        setLoading(true)
        try {
            const response = await fetch(`${api_url}auth/login`, {
                method: 'POST',
                body: JSON.stringify(userDetails),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': api_url
                },
                // necessary to store access token in browser
                withCredentials: true,
                credentials: 'include',
                crossDomain: true,
            })
            console.log(response.status)
            const resObject = await response.json();
            if (response.status != 200) {
                alert(resObject.message)
                return
            }
            console.log('logged in');
            navigate('/')
        }
        catch (err) {
            console.log(err)
            alert('Server Error')
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <div className="login-page flex flex-col justify-center">
            <div className="login">
                <div className="logo text-center mb-7">
                    <Link to='/'>
                        <FontAwesomeIcon icon={faBlog} size='2x' />
                    </Link>
                </div>
                <h1 className="auth-title text-center text-4xl font-bold mb-10">Sign in</h1>
                <form action="#" className="mb-3 grid gap-8">
                    <TextField
                        fullWidth
                        size='small'
                        variant="outlined"
                        label="Email"
                        id="email"
                        value={userDetails.email}
                        onChange={handleChange}
                    />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        size='small'
                        fullWidth
                        variant="outlined"
                        label="Password"
                        id="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={userDetails.password}
                        onChange={handleChange}
                    />
                    <Button fullWidth variant="contained"
                        // style={{
                        //     backgroundColor: '#1565c0',
                        //     color: 'white',
                        //     textTransform: 'none',
                        //     fontSize: '1.1rem',
                        // }}
                        onClick={login}
                        disabled={loading}
                        type="button"
                    >
                        {loading ? <CircularProgress size={35} /> : 'Sign in'}
                    </Button>
                </form>

                <Link>
                    <p className="forgot-password text-center mb-8">Forgot Password?</p>
                </Link>
                <p className="text-center mb-4 font-semibold font-lg">Dont have an account?</p>
                <Link to="/auth/register">
                    <Button fullWidth variant="outlined"
                        style={{
                            color: 'black',
                            borderColor: 'black',
                            boxShadow: '0px 4px 4px -2px rgba(0, 0, 0, 0.25)',
                            borderColor: '#cccccc',
                            textTransform: 'none',
                            fontSize: '1.1rem'
                        }}>
                        Create new account
                    </Button>
                </Link>
            </div>
        </div>
    );
}
