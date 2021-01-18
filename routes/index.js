import { Router } from 'express'
import jwt from 'jsonwebtoken'
const router = Router()

import * as User from '../controllers/user.js'

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

router.post('/login', upload.none(), async (req, res, _next) => {
    //TODO: Update last online
    try {
        const { email, password, remember } = req.body
        console.log(req.body)

        const user = await User.checkCredentials(email, password)

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
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

router.get('/login', (req, res, _next) => {
    if (req.user?.name)
        res.redirect('/')
    else
        res.render('login')
})

//TODO: Should be done in the browser
router.post('/logout', (req, res, _next) => {
    const name = req.user?.name
    res.clearCookie('JWT')
    res.status(200).jsonp({ Message: `Goodbye ${name}` })
})

router.get('/logged', (req, res, _next) => {
    res.status(200).jsonp({ Message: `Hello ${req.user?.name}` })
})

router.get('/signup', (req, res, _next) => {
    if (req.user.username)
        res.redirect('/')
    else
        res.render('signup')
})

router.post('/signup', upload.single('picture'), async (req, res, _next) => {
    console.log(req.body)
    console.log(req.file)

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

export default router;
