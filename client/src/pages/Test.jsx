import { useState } from "react"
import { base_url, api_url } from '../helper/variables.js'

export default function Test() {
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("")

    async function handleCLick() {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', title)
        formData.append('content', content)
        formData.append('category', category)
        // formData.append('username', 'john12')

        try {
            const response = await fetch(`${api_url}posts/`, {
                method: 'POST',
                body: formData,
                // necessary to store access token in browser
                withCredentials: true,
                credentials: 'include'
            })

            if(!response.ok) {
                console.log('error')
            }
            console.log(await response.json())
        }
        catch(err) {
            console.log(err)
        }
    }

    return <div className="test">
        <h1>Test Page</h1>
        <form>
            Title: <input type="text" style={{border: '1px solid black', width: '100%', height: '50px'}} onChange={(e) => {setTitle(e.target.value)}} />
            <br />
            Content: <input type="text-area" style={{border: '1px solid black', width: '100%', height: '70px'}} onChange={(e) => {setContent(e.target.value)}} />
            <br />
            Category: <input type="text" style={{border: '1px solid black', width: '100%', height: '30px'}} onChange={e => setCategory(e.target.value)} />
            <input type="file" onChange={(e) => { setFile(e.target.files[0]) }}/>
            <br />
            <button onClick={handleCLick} type='button'>upload</button>
        </form>

    </div>
}