require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2
const app = express();

const PORT = process.env.PORT || 7000
const clientUrl = process.env.CLIENT_URL
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
const api_key = process.env.CLOUDINARY_API_KEY
const api_secret = process.env.CLOUDINARY_API_SECRET

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')


// Set CORS headers
app.use(cors({
    credentials: true,
    origin: clientUrl,
    // allowedHeaders: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
}))

// Allow credentials and specific origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Origin', clientUrl)
    next()
})

app.use(express.json())
app.use(cookieParser())
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/posts', postRouter)
app.use('/users', userRouter)


cloudinary.config({
    cloud_name,
    api_key,
    api_secret
})

mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true, useUnifiedTopology: true
    }
)
    .then(() => console.log('Database connection successfull'))
    .catch((err) => console.log('error in db connection', err))


app.listen(7000, () => { console.log(`Server running on port ${PORT}`) })