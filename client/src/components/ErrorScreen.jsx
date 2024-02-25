
export default function ErrorScreen({ errorMessage }) {

    return (
        <div className="error-screen">
            <div>{errorMessage}</div>
        </div>
    )
}