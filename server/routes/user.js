const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const User = require('../models/User')
const Article = require('../models/Article')

// test 
router.get('/test', (req, res) => {
    res.status(200).json({msg: 'test route'})
})

// get a specific user details
router.get('/:username', async (req, res) => {
    const {username} = req.params

    try {
        console.log('Username = ', username)
        const userDoc = await User.findOne({username})
        // if user not present
        if(!userDoc) {
            res.status(404).json({ msg: 'User does not exist' })
            return
        }

        res.status(200).json(userDoc)
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
})


// get a user posts
router.get('/:username/posts', async (req, res) => {
    const username = req.params.username
    try {
        const userDoc = await User.findOne({username})
        console.log(userDoc.blogs)
        if(!userDoc) {
            return res.status(404).json({msg: 'No user found'})
        }
        const blogIds = userDoc.blogs

        const posts = []
        for(let i=0 ; i<blogIds.length ; i++) {
            const blogId = blogIds[i]
            const post = await Article.findById(blogId)
            posts.push(post)
        }
        res.status(200).json({msg: 'Success', blogs: posts})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
})


module.exports = router