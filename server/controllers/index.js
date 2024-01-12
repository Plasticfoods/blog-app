const User = require('../models/User')
const Blog = require('../models/Blog')


// returns the user profile
async function getProfile(req, res) {
    const {username} = req.params

    try {
        console.log('Username = ', username)
        const user = await User.findOne({username})
        
        if(!user) {
            res.status(404).json({ msg: 'User does not exist' })
            return
        }

        let loggedIn = false
        if(req.token !== null) loggedIn = true
        res.status(200).json({loggedIn: loggedIn, userInfo: user})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
}


// get users all posts
async function getUserPosts(req, res) {
    const username = req.params.username
    console.log(username)
    try {
        const userDoc = await User.findOne({username})
        if(!userDoc) {
            return res.status(400).json({msg: 'No user found'})
        }
        const blogIds = userDoc.blogs

        const posts = []
        for(let i=0 ; i<blogIds.length ; i++) {
            const blogId = blogIds[i]
            const post = await Blog.findById(blogId)
            posts.push(post)
        }
        res.status(200).json({msg: 'Success', blogs: posts})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
}

// returns users own data
async function getMyProfile(req, res) {
    console.log('index route')
    try {   
        if(!req.token) {
            return res.status(200).json({
                loggedIn: false,
                userData: null
            })
        }

        return res.status(200).json({loggedIn: true, userData: req.userDoc})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
}

module.exports = {
    getProfile,
    getUserPosts,
    getMyProfile
}