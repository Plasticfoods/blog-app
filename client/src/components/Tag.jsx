import { Link } from "react-router-dom"

export default function Tag(props) {
    return (
            <div className="tag">
                {props.tagName}
            </div>    
    )
}