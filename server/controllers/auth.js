const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expiryTime = process.env.SESSION_EXPIRY_TIME


async function register(req, res) {
    const { name, username, email, password } = req.body

    try {
        let userDoc = await User.findOne({email})
        if(userDoc) {
            res.status(409).json({ msg: "Email address in use", key: 'email', success: false })
            return
        }
        userDoc = await User.findOne({username})
        if(userDoc) {
            res.status(409).json({ msg: "Username already exist", key: 'username', success: false })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
        });
        await newUser.save()
        console.log('registration successfull')

        res.status(200).send({ msg: 'User registration successfull', success: true })
    }
    catch (err) {
        console.log(err.message)
    }
}


async function login(req, res) {
    const { email, password } = req.body

    try {
        let userDoc = await User.findOne({ email })
        // if user not present
        if (!userDoc) {
            res.status(401).json({ msg: 'Email not found' })
            return
        }
        // matching password
        const isMatch = await bcrypt.compare(password, userDoc.password)
        if (!isMatch) {
            res.status(401).json({ msg: 'Password does not match' })
            return
        }

        // generate JWT
        const payload = {
            sub: userDoc._id,
            name: userDoc.name,
            username: userDoc.username
        }
        const newToken = {
            token: jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' }),
            date: new Date()
        }

        console.log('new token', newToken.token)

        // Deleting tokens which were created before 24 hours or expiry time
        const oldTokens = userDoc.tokens
        updatedTokens = oldTokens.filter(element => {
            const timeDifference = new Date().getTime() - element.createdAt.getTime()
            if(timeDifference < expiryTime) return true
        })
        updatedTokens.push(newToken)

        await User.findByIdAndUpdate(
            userDoc._id,
            { $set: { tokens: updatedTokens } },
            { new: true },
        )

        // set JWT in cookie
        res.cookie("access_token", newToken.token, {
            httpOnly: true,
            secure: true
        })
        // res.cookie('uid', userDoc._id, { httpOnly: false })
        res.status(200).json({ msg: 'logged in', token: newToken.token })
        console.log('logged in')
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
}


async function logout(req, res) {
    try {
        if (!req.token) {
            res.status(401).json({ msg: 'Unauthorized' })
            return
        }

        const oldTokens = req.userDoc.tokens
        const currToken = req.cookies.access_token

        updatedTokens = oldTokens.filter((element) => {
            if (element.token !== currToken) return true
        })

        // update the token array in user document
        await User.findByIdAndUpdate(req.userDoc._id, { tokens: updatedTokens })

        res.clearCookie("access_token")
        console.log('logged out')
        res.status(200).json({ message: "Logged out." });
    }
    catch (err) {
        console.log(err)
    }

}

module.exports = {
    register,
    login,
    logout
}