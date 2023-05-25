const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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
    }

    res.send()
}

module.exports = {
    getProfile
}