const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const User = require('../models/User')
const Blog = require('../models/Blog')

// test 
router.get('/test', (req, res) => {
    res.status(200).json({message: 'test route'})
})

// get a specific user details
router.get('/:username', async (req, res) => {
    const {username} = req.params

    try {
        console.log('Username = ', username)
        const userDoc = await User.findOne({username})
        // if user not present
        if(!userDoc) {
            res.status(404).json({ message: 'User does not exist' })
            return
        }

        res.status(200).json(userDoc)
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message: 'Server Error'})
    }
})


// get a user posts
router.get('/:username/posts', async (req, res) => {
    const username = req.params.username
    try {
        const userDoc = await User.findOne({username})
        if(!userDoc) {
            return res.status(404).json({message: 'No such user present'})
        }

        const blogDocs = await Blog.find({username})

        res.status(200).json({message: 'Success', blogs: blogDocs})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router