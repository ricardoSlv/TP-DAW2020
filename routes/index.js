import { Router } from 'express'
import jwt from 'jsonwebtoken'
const router = Router()

router.post('/login', (req, res, _next) => {
    const token = jwt.sign({
        username: req.body.username,
        expiresIn:'1d'
    },process.env.JWTSECRET)

    res.cookie('JWT', token, {
        maxAge: 86_400_000,
        httpOnly: true
    })

    res.status(200).jsonp({Message: `Welcome ${req.body.username}`})
})

router.get('/login', (req, res, _next) => {
    if(req.user.username)
        res.redirect('/')
    else
        res.render('login')
})

router.get('/logout', (req, res, _next) => {
    const username = req.user?.username
    res.clearCookie('JWT')
    res.status(200).jsonp({Message: `Goodbye ${username}`})
})

router.get('/logged', (req, res, _next) => {
    res.status(200).jsonp({Message: `Hello ${req.user.username}`})
})

router.get('/signup', (req, res, _next) => {
    if(req.user.username)
        res.redirect('/')
    else
        res.render('signup')
})

router.post('/signup', (_req, res, _next) => {
    // Add multer, check for duplicate email/name
    res.status(200)
})

export default router;
