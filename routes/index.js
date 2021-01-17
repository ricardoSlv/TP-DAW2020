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
            name: user.name,
            expiresIn: '1d'
        }, process.env.JWTSECRET)

        res.cookie('JWT', token, {
            maxAge: remember ? 86_400_000 : null,
            httpOnly: true
        })

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

router.post('/signup', upload.single('picture') , (req, res, _next) => {
    //TODO:  Add multer, check for duplicate email/name, add createdAt field
    console.log(req.body)
    console.log(req.file)
    // try{
    //     const user = User.insert(req.body)
    // }catch(e){
    //     console.log(e)
    // }
    res.status(200).send()
})

export default router;
