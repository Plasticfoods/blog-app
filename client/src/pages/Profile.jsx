import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import Header2 from '../components/Header2'

export default function Profile() {
    const {username} = useParams()
    const navigate = useNavigate()

    function logout(e) {
        e.preventDefault()

        fetch('http://localhost:7000/auth/logout', {
            method: 'POST',
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            console.log('logged out')
            navigate('/')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="profile">
            <Header2 />
            profile page
            <br />
            <p>Name: {username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}