import Tag from "./Tag"
import ShortBlog from "./ShortBlog"
const blogs = [{imageLink: 'https://miro.medium.com/v2/resize:fit:828/format:webp/1*jyZQjnQAlcoeNCQ8oBkujA.jpeg'}, 
    {imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png'}, 
    {imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/0*jxVHjlRyDYVgFuyE'},
    {imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png'},
    {imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png'},
    {imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png'},
    {imageLink: 'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png'}]

export default function Main() {
    return (
        <main>
            <aside className="home-aside">
                <h3 className="home-aside-title">Discover more of what matters to you</h3>
                <div className="tags">
                    <Tag tagName='Programming' />
                    <Tag tagName='JavaScript' />
                    <Tag tagName='Data Science ' />
                    <Tag tagName='Tarvel' />
                    <Tag tagName='Writing' />
                    <Tag tagName='Productivity' />
                    <Tag tagName='Self Improvement' />
                    <Tag tagName='Machine Learning' />
                    <Tag tagName='Life' />
                </div>
            </aside>

            <section className="short-blogs">
                {
                    blogs.map((element, index) => {
                        return <ShortBlog imageLink={element.imageLink} key={index} id={index} />
                    })
                }
                {/* <ShortBlog imageLink={'https://miro.medium.com/v2/resize:fit:828/format:webp/1*jyZQjnQAlcoeNCQ8oBkujA.jpeg'} />
                <ShortBlog imageLink={'https://miro.medium.com/v2/resize:fill:250:168/1*aqmtMRh9xnVwp6-5EEJ4KQ.png'} />
                <ShortBlog imageLink={'https://miro.medium.com/v2/resize:fill:250:168/0*jxVHjlRyDYVgFuyE'} /> */}
            </section>

        </main>
    )
}