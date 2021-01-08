import { Router } from 'express'
import jwt from 'jsonwebtoken'
const router = Router()

router.get('/login', (req, res, _next) => {
    const token = jwt.sign({
        username: req.query.username,
        expiresIn:'1d'
    },process.env.JWTSECRET)

    res.cookie('JWT', token, {
        maxAge: 86_400_000,
        httpOnly: true
    })

    res.status(200).jsonp({Message: `Welcome ${req.query.username}`})
})

router.get('/logout', (req, res, _next) => {
    const username = req.user?.username
    res.clearCookie('JWT')
    res.status(200).jsonp({Message: `Goodbye ${username}`})
})

router.get('/logged', (req, res, _next) => {
    res.status(200).jsonp({Message: `Hello ${req.user.username}`})
})




export default router;
