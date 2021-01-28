import { Router } from 'express'
const router = Router()

import * as Post from '../controllers/post.js'
import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

router.get('/upload', (req, res, _next) => {
    res.render('posts/upload',{user: req.user})
})

// Post a new post 
router.post('/upload', upload.none(), async (req, res, _next) => {
    try {
        const post = await Post.insert(req.user, req.body)
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

router.get('/:id', async (req, res, _next) => {
    try {
        const post = await Post.findById(req.params.id)
        res.render('posts/post',{user: req.user, post})
    } 
    catch (e) {
        console.log(e)
        //TODO 404
        if (e.message === '401')
            res.status(401).send()
        else
            res.status(500).send()
    }
})

router.post('/:id/comment', async (req, res, _next) => {
    try {
        await Post.addComment(req.params.id, req.user, req.body)
        console.log(req.body)
        const post = await Post.findById(req.params.id)
        res.render('posts/post',{user: req.user, post})
    } 
    catch (e) {
        console.log('e', e)
        res.status(500).send()
    }
})

export default router;
