const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files


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
        const result = await uploadImage(req.file.path)
        if(result.secure_url === undefined) {
            res.status(400).json({msg: result.message})
            return
        }
        
        const newPost = new Article({
            ...req.body,
            imageUrl: result.secure_url,
            author: '6452a96044851b2c5d6a8b87'
        })
        await newPost.save()
        console.log('Post uploaded')
        res.status(200).json({ msg: 'Post uploaded' })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
});


// get a specific post with id
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId
    try {
        const post = await Article.findById(postId)
        res.status(200).json({})
    }
    catch (err) {
        console.log(err)
    }
});


// updation in a blog post
router.patch("/:postId");


// delete a post
router.delete("/:postId");


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


