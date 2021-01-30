import { Router } from 'express'
import jwt from 'jsonwebtoken'
const router = Router()

import * as User from '../controllers/user.js'

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

router.get('/login', (req, res, _next) => {
    if (req.user)
        res.redirect('/')
    else
        res.render('auth/login')
})

router.get('/logout', (_req, res, _next) => {
    res.clearCookie('JWT')
    res.redirect('/')
})

router.get('/signup', (req, res, _next) => {
    if (req.user)
        res.redirect('/')
    else
        res.render('auth/signup')
})

router.post('/login', async (req, res, _next) => {
    try {
        const { email, password, remember } = req.body

        const user = await User.checkCredentials(email, password)

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            level: user.name,
            expiresIn: '1d'
        }, process.env.JWTSECRET)

        const cookieOptions = remember === 'true' ? 
        { maxAge: 86_400_000, httpOnly: true} 
        : {httpOnly: true}
        
        res.cookie('JWT', token, cookieOptions)

        res.status(200).jsonp({ Message: `Welcome ${user.name}` })
    } catch (e) {
        console.log(e)
        if (e.message === '401')
            res.status(401).send()
        else
            res.status(500).send()
    }
})

router.post('/signup', upload.single('picture'), async (req, res, _next) => {
    try {
        const user = await User.insert(req.body, req.file)
        res.status(200).send(user)
    } catch (e) {
        console.log(e)
        if (e.message === '409')
            res.status(409).send()
        else
            res.status(500).send()
    }
})

export default router
