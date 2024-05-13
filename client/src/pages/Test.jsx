import * as React from 'react';
import { useState, useEffect } from "react"
import { base_url, api_url } from '../helper/variables.js'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import EditProfile from '../components/EditProfile.jsx';

export default function Test() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        ;(async() => {
            try {
                const response = await axios.get(`${api_url}myprofile`, {
                    withCredentials: true,
                    credentials: 'include'
                })
                setUser(response.data.userData)
            } catch (error) {
                console.log(error)
            }
        })()
    })

    const updateUserInfo = async () => {
        try {
            const response = await axios.put(`${api_url}users/${user.username}`, {
                ...user
            }, {
                withCredentials: true,
                credentials: 'include'
            })
            console.log(response.data)
            setUser(response.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    if(!user) return (
        <div>
            Loading...
        </div>
    )

    return (
        <div className="test" style={{ padding: '2rem' }}>
            <EditProfile user={user} updateUserInfo={updateUserInfo} />
            <div style={{ marginTop: '2rem' }}>
                <Typography variant="h5">
                    User Info
                </Typography>
                <Typography variant="body1">
                    Name: {user.name}
                </Typography>
                <Typography variant="body1">
                    Username: {user.username}
                </Typography>
                <Typography variant="body1">
                    Email: {user.email}
                </Typography>
            </div>
        </div>
    )
}