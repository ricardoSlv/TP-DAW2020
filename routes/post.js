import { Router } from 'express'
const router = Router()

import * as Post from '../controllers/post.js'

// Post a new post 
router.post('/new', async (req, res, _next) => {
    try {
        const post = await Post.insert(req.body)
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
