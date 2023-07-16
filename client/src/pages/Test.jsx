import { useState } from "react"

export default function Test() {
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    async function handleCLick() {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', title)
        formData.append('content', content)
        formData.append('username', 'john12')

        try {
            const response = await fetch('http://localhost:7000/posts/', {
                method: 'POST',
                body: formData
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
            <input type="file" onChange={(e) => { setFile(e.target.files[0]) }}/>
            <br />
            <button onClick={handleCLick} type='button'>upload</button>
        </form>

    </div>
}