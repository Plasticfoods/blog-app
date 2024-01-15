import { base_url } from "./variables";

const createBlogUrl = (title, blogId) => {
    // Use a regular expression to keep only alphabetic characters and spaces
    const alphabetsOnly = title.replace(/[^a-zA-Z ]/g, "");

    // Convert to lowercase and replace spaces with hyphens
    const formattedString = alphabetsOnly.toLowerCase().replace(/\s+/g, "-");
    
    // add blogId at tail
    const path = formattedString + '-' + blogId
    const url = base_url + 'posts/' + path
    
    return url
};

export default createBlogUrl
