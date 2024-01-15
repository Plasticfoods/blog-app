const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files
const verifyToken = require('../middlewares/verifyToken')
const blogController = require('../controllers/blog')


// get all blog posts
router.get("/", blogController.getBlogs);


// upload a blog post
router.post("/", verifyToken, upload.single('image'), blogController.uploadBlog);


// get a specific post with id
router.get("/:postId", blogController.getBlog);


// updation in a blog post
router.patch("/:postId");


// delete a post
router.delete("/:postId", verifyToken, async (req, res) => {
    if (!req.token) return res.status(401).json({ message: 'Unauthorized' })

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
    
        // deleting a blog from Blog 
        const deletedPost = await Blog.deleteOne({ _id: req.params.postId })
        res.status(200).json({ message: 'Blog deleted' })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message: 'Server Error'})
    }
})


// delete all posts 
// router.delete('/', async (req, res) => {
//     try {
//         if(req.body.token !== "blog_app_delete_all") {
//             console.log('Unable to delete posts')
//             return res.status(401).json({message: 'Invalid token'})
//         }

//         await Blog.deleteMany({})
//         res.status(200).json({message: 'posts deleted'})
//     }
//     catch(err) {
//         console.log(err)
//     }
// })



module.exports = router;


