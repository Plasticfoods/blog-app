import imgPath from '../images/user-profile-icon.svg'
import Tag from './Tag'
import { Link } from 'react-router-dom'

export default function PostSummery(props) {
    let authorImage = imgPath
    if (props.authorImage === undefined) authorImage = imgPath
    else authorImage = props.authorImage

    return (
        <div className="post-summery">
            <Link className="summery-content" to={`/posts/${props.id}`}>
                <p className="summery-author">
                    <div className="author-image">
                        <img src={authorImage} alt="" />
                    </div>
                    <div className="author-name"> {props.authorName}</div>
                </p>
                <p className="summery-title"> {props.summeryTitle}</p>
                <p className="summery-line"> {props.summeryLine}</p>
                <div className="post-details">
                    <p className="post-date">{props.postDate}</p>
                    <Tag tagName={props.tag} />
                </div>
            </Link>
            <div className="summery-image">
                <img src={props.summeryImage} alt="blog image" />
            </div>
        </div>
    )
}