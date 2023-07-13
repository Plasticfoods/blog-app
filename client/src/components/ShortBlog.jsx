import { Link } from "react-router-dom"
const base = 'http://localhost:3000/'

export default function ShortBlog(props) {

    {/* A blog in short form  */ }
    return <div className="short-blog">
        {/* Author name, title, content etc.. */}
        <div className="short-blog-left">
            <Link className="short-blog-author-name link" to={`${base}r8`}>@r8</Link>
            <h3 className="short-blog-title">Diary of an Interstellar Voyage, Report 35</h3>
            <p className="short-blog-content">These aren’t travel tips, but ways of thinking about taking time off or going on vacation that can help level up your approach...</p>
            <div className="short-blog-details">
                <p className="date">Jul 8</p>
                <div>.</div>
                <Link className="tag-name link">Devolopment</Link>
            </div>
        </div>
        {/* Blog Image */}
        <picture className="short-blog-right">
            <img src={props.imageLink} alt="blog image" className="short-blog-image" />
        </picture>
    </div>
}