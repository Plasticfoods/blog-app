import { useState } from "react"

export default function Test() {
    const [file, setFile] = useState(null)

    async function handleCLick() {
        if(!file) return;

        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', 'My Title threeI have a mongoose collection. ')
        formData.append('content', 'To replace an existing array field with a new array in a Mongoose collection, you can use the $set operator in a MongoDB update operation.')
        formData.append('username', 'r8')

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