import { Router } from 'express'
const router = Router()

import * as User from '../controllers/user.js'
import * as Resource from '../controllers/resource.js'
import * as Post from '../controllers/post.js'

//TODO: Proteger as rotas, error handling

router.get('/', async (req, res, _next) => {
    const users = await User.list()
    res.render('users/users',{user: req.user, users})
})

router.get('/profile', async (req, res, _next) => {
    const user = await User.findById(req.user?._id)

    if (user){
        const resources = await Resource.filterByProducer(req.user._id) 
        const posts = await Post.filterByProducer(req.user._id)
        res.render('users/profile',{user, posts, resources})
    }
    else
        res.redirect('/login')
})

router.get('/:id', async (req, res, _next) => {
    const user = await User.findById(req.params.id)

    if (user){
        const resources = await Resource.filterByProducer(req.params.id, true) 
        const posts = await Post.filterByProducer(req.params.id)
        res.render('users/user', {user, posts, resources} )
    }
    else
        res.sendStatus(404)
})

router.get('/:id/picture', async (req, res, _next) => {
    if (req.user){
        res.download('./user_files/'+req.params.id+'/picture')
    }else
        res.error(401,{user: req.user})
})

export default router
