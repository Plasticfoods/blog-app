import Tag from "./Tag"
import Posts from "./Posts"
const posts = []

export default function Main() {
    return (
        <main>
            <Posts blogs={posts} />
            <div className="sidebar tags">
                <p className="tags-title font-bold mb-5">Discover more of what matters to you</p>
                <div className="tags">
                    <Tag tagName="Programming"/>
                    <Tag tagName="Data science"/>
                    <Tag tagName="Writing"/>
                    <Tag tagName="Python"/>
                    <Tag tagName="Machine learning"/>
                </div>
            </div>
        </main>    
    )
}