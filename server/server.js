require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2;
const PORT = process.env.PORT || 7000

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

// app.use(cors())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/posts', postRouter)
app.use('/', indexRouter)


cloudinary.config({
    cloud_name: 'dq6drt1el',
    api_key: '679222394755316',
    api_secret: 'esy9qgDLbz4UYkHd5606DJiu98s'
});

mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
)
    .then(() => console.log('Database connection successfull'))
    .catch((err) => console.log('error in db connection', err));


app.listen(7000, () => { console.log(`Server running on port ${PORT}`) })