import {Link } from 'react-router-dom'

export default function Tag(props) {
    return (
            <Link className="tag" to={`/posts/tag/${props.tagName.trim()}`}>
                {props.tagName}
            </Link>    
    )
}