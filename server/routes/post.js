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
        const blogDocs = await Article.find();
        res.status(200).json(blogDocs);
    } catch (err) {
        console.log(err);
    }
});


// upload a blog post
router.post("/", verifyToken, upload.single('image'), async (req, res) => {
    try {
        if(!req.token) {
            return res.status(401).json({msg: 'Can not upload blog, unauthorized'})
        }

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
        
        // A regular expression to find and replace all occurrences of one or more consecutive white spaces with a single space
        req.body.title = req.body.title.trim().replace(/\s+/g, ' ')

        const userDoc = req.userDoc
        if(imageUrl === null) imageUrl = 'https://res.cloudinary.com/dq6drt1el/image/upload/v1690996889/default-blog-image_wjf0f7.jpg'
        
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
            console.log('Article not found')
            return res.status(404).json({ msg: 'Article not found' })
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
        const userDoc = req.userDoc
        const blogIds = userDoc.blogs

        for (let i = 0 ; i<blogIds.length ; i++) {
            if (blogIds[i] == req.params.postId) {
                blogIds.splice(i, 1)
                break
            }
        }
        await User.updateOne(
            { _id: userDoc._id }, // Query to find the document by its _id
            { $set: { blogs: blogIds } } // New array to replace the existing array
        );
    
        // deleting a blog from Article 
        const deletedPost = await Article.deleteOne({ _id: req.params.postId })
        res.status(200).json({ msg: 'Article deleted' })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
})


// delete all posts 
// router.delete('/', async (req, res) => {
//     try {
//         if(req.body.token !== "blog_app_delete_all") {
//             console.log('Unable to delete posts')
//             return res.status(401).json({msg: 'Invalid token'})
//         }

//         await Article.deleteMany({})
//         res.status(200).json({msg: 'posts deleted'})
//     }
//     catch(err) {
//         console.log(err)
//     }
// })


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
        console.error(error)
        return error
    }
};


module.exports = router;


