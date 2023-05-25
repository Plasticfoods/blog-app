const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = async function(req, res, next) {
    const token = req.cookies.access_token

    if(!token) {
        req.token = null
        console.log('token not found')
        next()
        return
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
            if (err) {
                console.log('Invalid token')
                return res.status(500).send({ msg: 'authentication failed'})
            }
            
            req.user = await User.findById(decoded.sub)
            req.token = decoded.sub
            req.userValid = true
            console.log('token verified')

            next()
            return
        })
    }
    catch(err) {
        console.log(err)
    }
}