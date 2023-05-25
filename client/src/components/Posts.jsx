import PostSummery from "./PostSummery";
import { useState } from "react";

export default function Posts() {
    const [posts, setPosts] = useState([])

    return (
        <div className="posts">
            { posts.map((element, index) => {
                return (
                    <PostSummery 
                        key={index}
                        id={element.id}
                        authorName={element.authorName}
                        summeryTitle={element.summeryTitle}
                        summeryLine={element.summryContent}
                        postDate={element.date}
                        tag={element.tag}
                        summeryImage="https://miro.medium.com/v2/resize:fill:250:168/0*fDHA_4K1QRIsktoI"
                    />
                )
            }) }
        </div>    
    );
}