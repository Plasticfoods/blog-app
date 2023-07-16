import {Link} from 'react-router-dom'
// logo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBlog } from '@fortawesome/free-solid-svg-icons' 

export default function Footer() {
    return (
        <footer className="footer">
            <h1 className="logo-title flex grow-[3] gap-4 pb-2">
                <div className="logo">
                    <FontAwesomeIcon icon={faBlog} size='2x' />
                </div>
                <Link to='/'>
                    <h1 className="name">Skeleton</h1>
                </Link>
            </h1>
            <div className="footer-links">
                <Link className="footer-item link">Help</Link>
                <Link className="footer-item link hide">Status</Link>
                <Link className="footer-item link hide">Writers</Link>
                <Link className="footer-item link">Blog</Link>
                <Link className="footer-item link hide">Careers</Link>
                <Link className="footer-item link">Privacy</Link>
                <Link className="footer-item link hide">Terms</Link>
                <Link className="footer-item link">About</Link>
                <Link className="footer-item link hide">Text to speech</Link>
                <Link className="footer-item link hide">Teams</Link>
            </div>

        </footer>    
    )
}

