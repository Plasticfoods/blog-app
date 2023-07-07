const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


async function register(req, res) {
    const { name, username, email, password } = req.body

    try {
        const isEmailPresent = await User.findOne({ email })
        if (isEmailPresent) {
            res.status(409).json({ msg: "Email address in use" })
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        console.log('registration successfull')

        res.status(200).send({ msg: 'User registration successfull' });
    }
    catch (err) {
        console.log(err.message)
    }
}


async function login(req, res) {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        // if user not present
        if (!user) {
            res.status(401).json({ msg: 'Email not found' })
            return
        }
        // matching password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).json({ msg: 'Password does not match' })
            return
        }
        console.log('logged in')
        
        // generate JWT
        const payload = {
            sub: user._id,
            name: user.name
        }
        const newToken = {
            token: jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' }),
        }
        const userDoc = await User.findByIdAndUpdate(
            user._id,
            { $push: { tokens: newToken } },
            { new: true },
        )

        // set JWT in cookie
        res.cookie("access_token", newToken.token, {
            httpOnly: true
        })
        res.cookie('uid', user._id, {httpOnly: false})
        res.status(200).json({ msg: 'logged in', token: newToken.token })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({msg: 'Server Error'})
    }
}


async function logout(req, res) {
    try {
        if(!req.token) {
            res.status(401).json({msg: 'Token not found'})
            return
        }

        const oldTokens = req.user.tokens
        const currToken = req.cookies.access_token

        updatedTokens = oldTokens.filter((element) => {
            if(element.token !== currToken) return true
        })

        const user = req.user
        await User.findByIdAndUpdate(user._id, {tokens: updatedTokens})
        
        res.clearCookie("access_token")
        console.log('logged out')
        res.status(200).json({ message: "Successfully logged out." });
    }
    catch(err) {
        console.log(err)
    }

}

module.exports = {
    register,
    login,
    logout
}