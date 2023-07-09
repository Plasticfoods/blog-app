import ShortPost from "./ShortPost";
import { useState, useEffect } from "react";

export default function Posts(props) {
    const [posts, setPosts] = useState(props.blogs);

    useEffect(() => {
        setPosts(props.blogs);
    }, [props.blogs]);

    return (
        <div className="posts">
            {posts.map((element, index) => {
                if (element && element.title && element.content && element.uploadDate && element._id) {
                    return (
                        <ShortPost
                            key={index}
                            id={index}
                            authorName={props.authorName}
                            summeryTitle={element.title}
                            summeryLine={element.content}
                            postDate={element.uploadDate}
                            postId={element._id}
                            // tag={element.tag}
                            summeryImage="https://miro.medium.com/v2/resize:fill:250:168/0*fDHA_4K1QRIsktoI"
                        />
                    );
                } else {
                    // Handle the case where necessary properties are null or undefined
                    return null;
                }
            })}
        </div>
    );
}
