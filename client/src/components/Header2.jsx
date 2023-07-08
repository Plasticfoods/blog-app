import profileIcon from '../images/user-profile-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faBell } from '@fortawesome/free-solid-svg-icons'; // logo
import { Link } from 'react-router-dom';

export default function Header2() {
    return (
        <header className="header2 mobile-padding pt-3">
            <div className="logo-title flex flex-row gap-2 lg:gap-6">
                <Link to='/' className='logo'>
                    <FontAwesomeIcon icon={faBlog} size='2x' />
                </Link>
                <div className="name">Skeleton</div>
            </div>
            <div className='nav-icons flex flex-row gap-10'>
                <Link className="notification-icon">
                    <FontAwesomeIcon icon={faBell}  />
                </Link>
                <Link className="profile-icon">
                    <img src={profileIcon} alt="profile icon" />
                </Link>
            </div>
        </header>
    );
}

