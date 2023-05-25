import { useParams } from "react-router-dom"

export default function Post() {
    const {postId} = useParams()
    console.log('postId: ', postId)

    return (
        <div className="post">
            blogPost
            <br />
            postId: {postId}
        </div>    
    )
}