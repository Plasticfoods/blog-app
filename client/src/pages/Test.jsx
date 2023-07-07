import { useState } from "react"

export default function Test() {
    const [file, setFile] = useState(null)

    async function handleCLick() {
        if(!file) return;

        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', 'title1')
        formData.append('content', 'content1')
        formData.append('author', 'author1')


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
            <input type="file" onChange={(e) => { setFile(e.target.files[0]) }}/>
            <br />
            <button onClick={handleCLick} type='button'>upload</button>
        </form>

    </div>
}