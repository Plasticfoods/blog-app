const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files
const verifyToken = require('../middlewares/verifyToken')


// get all blog posts
router.get("/", async (req, res) => {
    try {
        const blogPosts = await Article.find();
        res.status(200).json(blogPosts);
    } catch (err) {
        console.log(err);
    }
});


// upload a blog post
router.post("/", upload.single('image'), async (req, res) => {
    try {
        let imageUrl = null

        // checking if user has uploaded an image
        if(req.file) {
            const result = await uploadImage(req.file.path)
            if (result.secure_url === undefined) {
                res.status(400).json({ msg: result.message })
                return
            }
            imageUrl = result.secure_url
        }

        // getting user doc to get user id for new article document
        const userDoc = await User.findOne({ username: req.body.username })

        // added new blog post
        const newPost = new Article({
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

        console.log('Post uploaded')
        res.status(200).json({ msg: 'Post uploaded' })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
});


// get a specific post with id
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId
    try {
        const post = await Article.findById(postId)
        if (!post) {
            return res.status(400).json({ msg: 'Article not found' })
        }
        res.status(200).json(post)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
});


// updation in a blog post
router.patch("/:postId");


// delete a post
router.delete("/:postId", verifyToken, async (req, res) => {
    if (!req.token) return res.status(401).json({ msg: 'Unauthorized' })

    try {
        // get the user document and update blogs array
        const userDoc = await User.findById(req.userId)
        const blogIds = userDoc.blogs
        for (let i = 0; i < blogIds.length; i++) {
            if (blogIds[i] === req.params.postId) blogIds.splice(i, 1)
        }
        await User.updateOne(
            { _id: userDoc._id }, // Query to find the document by its _id
            { $set: { blogs: blogIds } } // New array to replace the existing array
        );
    
        // deleting a blog from Article 
        const deletedPost = await Article.deleteOne({ _id: req.params.postId })
        console.log(deletedPost)
        res.status(200).json({ msg: 'Article deleted' })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
});


// upload image to Cloudinary
const uploadImage = async (imagePath) => {
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
        console.error(error);
        return error
    }
};


module.exports = router;


