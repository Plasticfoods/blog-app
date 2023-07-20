import profileIcon from '../images/user-profile-icon.svg'

export default function UserDetails() {
    return <section className="user-details">
        <div className='flex flex-col gap-0 justify-center'>
            <h2 className="user-name">
                Anthony D. Mays
            </h2>
            <p className="user-about">A Skeleton user</p>
        </div>
        <picture className='user-image'>
            <img src={profileIcon} alt="profile image" />
        </picture>
    </section>
}