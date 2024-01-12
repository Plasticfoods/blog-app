const Blog = require('../models/Blog')
const cloudinary = require("cloudinary").v2;
// const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files
const User = require("../models/User");
const defaultBlogImage = 'https://res.cloudinary.com/dq6drt1el/image/upload/v1690996889/default-blog-image_wjf0f7.jpg'


const getBlogs = async (req, res) => {
    try {
        const blogDocs = await Blog.find();
        res.status(200).json(blogDocs);
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({message: 'Server Error'})
    }
}

const uploadBlog = async (req, res) => {
    try {
        if(!req.token) {
            return res.status(401).json({msg: 'Can not upload blog, unauthorized'})
        }

        let imageUrl = null

        // checking if user has uploaded an image
        if(req.file) {
            const result = await uploadImageToCloudinary(req.file.path)
            if (result.secure_url === undefined) {
                res.status(400).json({ msg: result.message })
                return
            }
            imageUrl = result.secure_url
        }
        
        // A regular expression to find and replace all occurrences of one or more consecutive white spaces with a single space
        req.body.title = req.body.title.trim().replace(/\s+/g, ' ')

        const userDoc = req.userDoc
        if(imageUrl === null) imageUrl = defaultBlogImage
        
        // added new blog post
        const newPost = new Blog({
            ...req.body,
            userId: userDoc._id,
            username: userDoc.username,
            name: userDoc.name,
            imageUrl: imageUrl
        })
        await newPost.save()

        // Find a user by their id and add an blogid to blogs array
        const updatedUser = await User.findOneAndUpdate(
            { _id: userDoc._id },
            { $push: { blogs: newPost._id } },
            { new: true }
        ).exec();

        console.log('Blog uploaded')
        res.status(200).json({ msg: 'Blog uploaded' })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
}

// get a specific blog with the help of id
const getBlog = async (req, res) => {
    const blogId = req.params.postId
    try {
        const blogDoc = await Blog.findById(blogId)
        if (!blogDoc) {
            console.log('Blog not found')
            return res.status(404).json({ msg: 'Blog not found' })
        }
        res.status(200).json(blogDoc)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
} 

// upload image to Cloudinary
const uploadImageToCloudinary = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result
    }
    catch (error) {
        console.error(error)
        return error
    }
};

module.exports = {
    getBlogs,
    uploadBlog,
    getBlog
}


