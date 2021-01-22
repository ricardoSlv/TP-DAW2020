import { Router } from 'express'
const router = Router()

import * as Post from '../controllers/post.js'
import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

router.get('/upload', (req, res, _next) => {
    res.render('post',{user: req.user})
})

// Post a new post 
router.post('/upload', upload.none(), async (req, res, _next) => {
    try {
        const post = await Post.upload(req.user, req.body)
        res.status(200).send(post)
    } 
    catch (e) {
        console.log(e)
        if (e.message === '401')
            res.status(401).send()
        else
            res.status(500).send()
    }
})


export default router;
