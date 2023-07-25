import Header2 from "../components/Header2"

export default function BlogPost() {
    return <article className="blog-post">
        <Header2 />
        <h1 className="blog-title">Left Amazon after 7.5+ years; Here is my honest review.</h1>
        <div className="blog-detail">
            <div className="name">Pooya Amini</div>
            <div className="flex gap-5">
                <Link className="category link">Culture</Link>
                <p>.</p>
                <p className="blog-date">Nov 11, 2022</p>
            </div>
        </div>
        <picture>
            <img src={'https://miro.medium.com/v2/resize:fit:828/format:webp/1*iiOnjn_ZymZZFUFI7YSI7g.jpeg'} alt="blog image" />
        </picture>
        <div className="content">
            I joined during one of the darkest times at Amazon. Thanks to the New York Times controversial article in 2015 (one year after I joined), Amazon started some internal changes to improve the work environment. I came on board as a junior engineer and left as a senior. Looking back on my time as an Amazon employee, I do realize that I had made a lot of mistakes on the job. However, I’m happy that at least I can now recognize what I did wrong and avoid making the same mistakes again over time. To cut the story short, it’s hard for me to think of specific times where I felt indifferent regarding Amazon. My emotion toward the company was basically either love or hate. Based on my personal experience, I would like to share some of the things that I liked the most about Amazon and what I think could be improved or changed altogether.
        </div>
    </article>
}