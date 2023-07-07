const User = require('../models/User')
const Article = require('../models/Article')


// returns the user profile
async function getProfile(req, res) {
    const {username} = req.params

    try {
        const user = await User.findOne({username})
        // if user not present
        if(!user) {
            res.status(401).json({ msg: 'User does not exist' })
            return
        }

        res.status(200).json(user)
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
}


// get users all posts
async function getUserPosts(req, res) {
    const username = req.params.username
    try {
        const userDoc = await User.findOne({username})
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
}


module.exports = {
    getProfile,
    getUserPosts
}