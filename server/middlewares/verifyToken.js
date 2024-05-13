const User = require('../models/User')
const jwt = require('jsonwebtoken')


// it attach userDoc, userId
module.exports = async function(req, res, next) {
    const token = req.cookies.access_token

    if(!token) {
        req.token = null
        console.log('Token not present')
        return next()
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
            if (err) {
                console.log('Invalid token')
                return res.status(401).send({ msg: 'Authentication failed'})
            }
            
            const userDoc = await User.findById(decoded.sub)
            if(!userDoc) return res.status(404).json({msg: 'User not found'})

            req.userDoc = userDoc
            req.token = decoded.sub
            req.userId = decoded.sub
            console.log('Token verified')

            next()
            return
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: 'Server Error'})
    }
}