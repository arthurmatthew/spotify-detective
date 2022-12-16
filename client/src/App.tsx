import { createRef, useState } from 'react'

function App() {
    const [img, setImg] = useState<string>()
    const inputRef = createRef<HTMLInputElement>()

    const getScreenshot = (url: string) => {
        fetch(
            'http://localhost:3030/screenshot?' +
                new URLSearchParams({ url: url })
        )
            .then(async (res) => {
                const data = await res.text()
                setImg(data)
            })
            .catch((err) => console.log(err))
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <p>https://www.</p>
                <input type="text" ref={inputRef} />
            </div>

            <button
                onClick={() =>
                    inputRef.current?.value != undefined &&
                    getScreenshot(`https://www.${inputRef.current?.value}`)
                }
            >
                Get Screenshot
            </button>
            <div>
                <img src={img} />
            </div>
        </div>
    )
}

export default App
