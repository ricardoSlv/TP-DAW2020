import { Router } from 'express'
const router = Router()

import * as Post from '../controllers/post.js'

router.get('/', async (req,res,_next)=>{
    if(req.user){
        const recentPubs = await Post.listRecent(10)
        const popularPubs = await Post.listPopular(10)
        res.render('landing/logged',{recentPubs, popularPubs, user: req.user})
    }else
        res.render('landing/notlogged',{user: req.user})
})

export default router
