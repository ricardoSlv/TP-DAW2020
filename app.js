import express from "express"
import bodyParser from "body-parser"
import logger from "morgan"

import createError from 'http-errors'

import path, { join } from "path"
const __dirname = path.resolve(path.dirname(''));

import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
const mongoDB = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@daw2020.akqj9.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

import usersRouter from './routes/users.js'

const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(join(__dirname, 'public')))

app.use('/users', usersRouter)

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
    res.render('error')
})

export default app
