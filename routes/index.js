import { Router } from 'express'
const router = Router()

import * as Post from '../controllers/post.js'
import * as User from '../controllers/user.js'

router.get('/', async (req,res,_next)=>{
    if(req.user){
        try {
            const recentPubs = await Post.listRecent(5)
            const popularPubs = await Post.listPopular(5)
            console.log(recentPubs)
            console.log(popularPubs)
            const favedPubs = await Post.listFaved(5)
            const favedUsers = await User.listFaved(5)
            res.render('landing/logged',{recentPubs, popularPubs, favedPubs, favedUsers, user: req.user})
        }
        catch(e){
            console.log("Error = " + e)
        }
    }else
        res.render('landing/notlogged',{user: req.user})
})

export default router
