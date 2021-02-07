import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import createError from 'http-errors'

import path, { join } from 'path'
const __dirname = path.resolve(path.dirname(''))

import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
const mongoDB = `mongodb://127.0.0.1:27017/tpdaw`
//const mongoDB = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@daw2020.akqj9.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

// Check if connection was sucessful
var db = mongoose.connection

import * as User from './controllers/user.js'

db.on('error', console.error.bind(console, 'MongoDB connection error...'))
db.once('open', function() {
    console.log('MongoDB connection successfull...')
})

import jwt from 'jsonwebtoken'

import indexRouter from './routes/index.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import resourcesRouter from './routes/resources.js'
import postRouter from './routes/posts.js'

//TODO: Cron Job to clean files lost on/
const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(join(__dirname, 'public')))

app.use((req, _res, next) => {
    jwt.verify(req.cookies.JWT, process.env.JWTSECRET, (e, payload) => {
        if (!e){
            req.user = {_id: payload._id, name: payload.name, level: payload.level}
            User.update({_id: payload._id},{$set:{lastOnline : new Date()}})
        }
    })
    next()
})

// Protect routes
const isLoggedIn = (req,res,next) => {
    if (req.user){
        next();
    }
    else {
        res.redirect('/')
        res.send()
    }
}

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/users', isLoggedIn, userRouter)
app.use('/resources', isLoggedIn, resourcesRouter)
app.use('/posts', isLoggedIn, postRouter)

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, _) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error',{user: req.user})
})

export default app
