const express = require('express')
const router = express.Router()

// get all blog posts
router.get('/')

// upload a blog post
router.post('/')

// get a specific post with id
router.get('/:postId')

// updation in a blog post
router.patch('/:postId')

// delete a post
router.delete('/:postId')


module.exports = router



