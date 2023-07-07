const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index') 
const verifyToken = require('../middlewares/verifyToken')

// index route
router.get('/', verifyToken, (req, res) => {
    console.log('request from /')

    if(!req.token) {
        res.json({
            token: null
        })
        return
    }

    res.status(200).json({
        token: req.token,
        userInfo: req.user
    })
})


// get a specific user details
router.get('/:username', indexController.getProfile)


// get a user posts
router.get('/:username/posts', indexController.getUserPosts)


// test route
router.post('/test', verifyToken, (req, res) => {
    console.log('test route')
    res.send(req.user)
})

module.exports = router
