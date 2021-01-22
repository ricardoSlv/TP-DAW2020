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

db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

import jwt from 'jsonwebtoken'

import indexRouter from './routes/index.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import resourcesRouter from './routes/resource.js'
import postRouter from './routes/post.js'

import * as User from './controllers/user.js'

//TODO: Cron Job para limpar os ficheiros perdidos no upload/
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

app.use((req, _res, next) => {
    console.log(req.cookies&&Object.keys(req.cookies))
    console.log(req.user&&Object.entries(req.user))
    console.log((req.user?._id, req.user?.name))
    next()
})

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/users',userRouter)
app.use('/resources', resourcesRouter)
app.use('/posts', postRouter)

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
