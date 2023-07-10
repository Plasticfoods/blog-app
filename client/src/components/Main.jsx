import Tag from "./Tag"
const posts = []

export default function Main() {
    return (
        <main>
            <aside className="home-aside">
                <h3 className="home-aside-title">Discover more of what matters to you</h3>
                <div className="tags">
                    <Tag tagName='Programming'/>
                    <Tag tagName='JavaScript' />
                    <Tag tagName='Data Science '/>
                    <Tag tagName='Tarvel' />
                    <Tag tagName='Writing' />
                    <Tag tagName='Productivity' />
                    <Tag tagName='Self Improvement' />
                    <Tag tagName='Machine Learning' />
                    <Tag tagName='Life' />

                </div>
            </aside>

            <section className="short-blogs">
                short blogs
            </section>

        </main>    
    )
}