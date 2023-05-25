import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <div className="hero">
            <h1 className="title"> Stay curious. </h1>
            <h3 className="subtitle"> Discover stories, thinking, and expertise from writers on any topic. </h3>
            <Link>
                <button className="btn btn-explore"> Start reading </button>
            </Link>
            <div className="image">
            </div>
        </div>    
    );
}