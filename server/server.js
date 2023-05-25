require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

// app.use(cors())
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/posts', postRouter)
app.use('/', indexRouter)

mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
)
.then(() => console.log('db connection successfull'))
.catch((err) => console.log('error in db connection', err));


app.listen(7000, () => { console.log(`Server running...`) })