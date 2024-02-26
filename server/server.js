require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2
const app = express();

const PORT = process.env.PORT || 7000
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
const api_key = process.env.CLOUDINARY_API_KEY
const api_secret = process.env.CLOUDINARY_API_SECRET

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')


const whitelist = ['http://localhost:3000', 'https://medium5.vercel.app', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5176', 'http://localhost:8000']; //white list consumers
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions))


// Set CORS headers
// app.use(cors({
//     credentials: true,
//     origin: clientUrl,
//     // allowedHeaders: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
// }))

// // Allow credentials and specific origin
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', 'true')
//     res.header('Access-Control-Allow-Origin', '*')
//     next()
// })

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
})
.then(() => console.log('Database connection successfull'))
.catch((err) => console.log('error in db connection', err))


app.listen(7000, () => { console.log(`Server running on port ${PORT}`) })