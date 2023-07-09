import imgPath from '../images/user-profile-icon.svg'
import Tag from './Tag'
import { Link } from 'react-router-dom'

export default function ShortPost(props) {
    let authorImage = imgPath
    if (props.authorImage === undefined) authorImage = imgPath
    else authorImage = props.authorImage

    return (
        // <div className="short-post">
        //     <Link className="summery-content" to={`/posts/${props.postId}`}>
        //         <p className="summery-author">
        //             <div className="author-image">
        //                 <img src={authorImage} alt="" />
        //             </div>
        //             <div className="author-name"> {props.authorName}</div>
        //         </p>
        //         <p className="summery-title"> {props.summeryTitle}</p>
        //         <p className="summery-line"> {props.summeryLine.substring(0,30)}</p>
        //         <div className="post-details">
        //             <p className="post-date">{props.postDate}</p>
        //             <Tag tagName={props.tag} />
        //         </div>
        //     </Link>
        //     <div className="summery-image">
        //         <img src={props.summeryImage} alt="blog image" />
        //     </div>
        // </div>

        <div className="short-post">
            <Link className="summery-content" to={`/posts/${props.postId}`}>
                <p className="summery-author">
                    <div className="author-image">
                        <img src={authorImage} alt="" />
                    </div>
                    <div className="author-name"> Avi Loeb </div>
                </p>
                <p className="summery-title"> Summary of the Successful Interstellar Expedition </p>
                <p className="summery-line"> We did it. I led a Galileo Project expedition to the Pacific Ocean to retrieve spherules of the first recognized interstellar meteor, IM1</p>
                <div className="post-details">
                    <p className="post-date">{props.postDate}</p>
                    <Tag tagName={'Travel'} />
                </div>
            </Link>
            <div className="summery-image">
                <img src={'https://miro.medium.com/v2/resize:fit:828/format:webp/1*aqmtMRh9xnVwp6-5EEJ4KQ.png'} alt="blog image" />
            </div>
        </div>
    )
}