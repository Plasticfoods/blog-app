import {Link } from 'react-router-dom'

export default function Tag(props) {
    return (
            <Link className="tag">
                {props.tagName}
            </Link>    
    )
}