import profileIcon from '../images/user-profile-icon.svg'
import { UserContext } from '../pages/Profile'
import { useContext, useState } from 'react'

export default function UserDetails(props) {

    // const [userData, setUserData] = useState(null)
    const userData = useContext(UserContext)

    return <section className="user-details">
        <div className='flex flex-col gap-0 justify-center'>
            <h2 className="user-name">
                {/* {props.userInfo !== undefined ? (props.userInfo.name) : ('Invalid User') } */}
                {userData.name}
            </h2>
            <p className="user-about">A Skeleton user</p>
        </div>
        <picture className='user-image'>
            <img src={profileIcon} alt="profile image" />
        </picture>
    </section>
}