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
            ['link'],
            ['clean'],
        ],
    };

    const styles = {
        height: "100%", // Adjust the height as needed
        overflowY: "auto",
        border: "1px solid black",
        borderRadius: "7px",
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
