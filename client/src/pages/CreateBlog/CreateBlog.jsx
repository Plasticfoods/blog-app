import Header2 from "../../components/Header2"
import { useState } from "react"
import Editor from "../../components/Editor";
import './CreateBlog.css'


function CreateBlog() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState(null)
    const [file, setFile] = useState(null)

    const handleClick = () => {
        console.log(title)
        console.log(content)

    }

    return (
        <div className="create-blog">
            <Header2 />
            <form className="fill-blog">
                <textarea className="py-3 px-4 block w-full rounded-lg text-xl border border-black" 
                    rows="1" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title}>
                </textarea>
                <form>
                    <label for="file-input" className="sr-only">Choose file</label>
                    <input type="file" name="file-input" id="file-input" className="block w-full border shadow-sm rounded-lg text-md focus:z-10 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600
                        file:py-3 file:px-4" />
                </form>
                <Editor content={content} setContent={setContent} />
                <button className="btn-add-blog ssp w-full text-white text-center text-lg font-bold py-3 px-4 rounded-lg" onClick={handleClick} type="button">
                    Publish!
                </button>
            </form>
        </div>
    )
}

export default CreateBlog
