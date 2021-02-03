import { Router } from 'express'
const router = Router()

import * as User from '../controllers/user.js'
import * as Resource from '../controllers/resource.js'
import * as Post from '../controllers/post.js'

//TODO: Proteger as rotas, error handling

router.get('/', async (req, res, _next) => {
    let users = await User.list()
    users = users.sort((u1,u2)=>u1.name.toLowerCase().localeCompare(u2.name.toLowerCase))
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

router.get('/admin', async (req, res, _next) => {
    const user = await User.findById(req.user?._id)

    if (user&&user.level.localeCompare("ADMN")==0){
        const resources = await Resource.list() 
        const posts = await Post.list()
        const users = await User.list() 
        res.render('users/admin',{user, posts, resources, users})
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
    else{
        res.status(401)
        res.render('error',{user: req.user,error: {status: 401, stack:'This page is only acessible to admins'}})
    }
})

router.get('/:id/picture', async (req, res, _next) => {
    if (req.user){
        res.download('./user_files/'+req.params.id+'/picture')
    }else
        res.error(401,{user: req.user})
})

router.post('/:id/favouritesPosts/', async (req, res, _next) => {
    try {
        await User.addfavPost(req.params.id,req.body._id,req.body.title)
        res.sendStatus(201)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})

router.post('/:id/favouritesResources/', async (req, res, _next) => {
    try {
        await User.addfavRes(req.params.id,req.body._id,req.body.title)
        res.sendStatus(201)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})

router.delete('/:id/favouritesPosts/:postid', async (req, res, _next) => {
    try {
        await User.remfavPost(req.params.id,req.params.postid)
        res.sendStatus(200)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})


router.delete('/:id/favouritesResources/:resid', async (req, res, _next) => {
    try {
        await User.remfavRes(req.params.id,req.params.resid)
        res.sendStatus(200)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req, res, _next) => {
    try {
        await User.deleteById(req.params.id)
        res.sendStatus(200)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})

export default router
