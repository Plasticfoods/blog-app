import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function Editor({ content, setContent }) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link'], // Remove 'image' from the toolbar
            ['clean'],
        ],
    };

    const styles = {
        height: "400px", // Adjust the height as needed
        overflowY: "auto", // Add scrollbar if content overflows
        border: "1px solid black", // Add border styles here
        borderRadius: "5px", // Optional: Add border-radius for rounded corners
    };

    return (
        <div className="content">
            <ReactQuill
                value={content}
                theme={'snow'}
                onChange={setContent}
                modules={modules}
                style={styles} />
        </div>
    );
}